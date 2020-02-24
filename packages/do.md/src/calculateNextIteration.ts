import * as R from "remeda";
import { LocalDate, ZonedDateTime, ZoneOffset, LocalTime } from "@js-joda/core";

import {
  Task,
  Repeat,
  RepeatSimple,
  RepeatWeekly,
  RepeatMonthly
} from "./types";
import { Rule } from "./rschedule";
import { getRepeatParams } from "./repeat";
import { getKeyValue, removeKeyValue, setKeyValue, hasKeyValue } from "./utils";
import { setDateField, stringToLocalDate, getDateField } from "./dates";
import { EVERY, AFTER, REPEAT, BY, FINISHED } from "./constants";

export const nextDateOfIterationSimple = (
  repeat: RepeatSimple,
  start: LocalDate
): LocalDate => {
  const { count, unit } = repeat;
  if (unit === "day") {
    return start.plusDays(count);
  } else if (unit === "week") {
    return start.plusWeeks(count);
  } else if (unit === "month") {
    return start.plusMonths(count);
  } else {
    const never: never = unit;
    throw new Error("Never error. #uOUoK2");
  }
};

export const getNextOccurrenceFromRule = (rule: Rule) => {
  const [next] = rule.occurrences({ take: 1 }).toArray();

  return LocalDate.from(next.date);
};

export const nextDateOfIterationWeekly = (
  repeat: RepeatWeekly,
  start: LocalDate
): LocalDate => {
  const rule = new Rule({
    frequency: "WEEKLY",
    byDayOfWeek: repeat.days,
    start: localDateToZonedDateTime(start)
  });
  return getNextOccurrenceFromRule(rule);
};

export const localDateToZonedDateTime = (start: LocalDate): ZonedDateTime => {
  return ZonedDateTime.of(start, LocalTime.of(), ZoneOffset.UTC);
};

export const nextDateOfIterationMonthly = (
  repeat: RepeatMonthly,
  start: LocalDate
): LocalDate => {
  const rule = new Rule({
    frequency: "YEARLY",
    byDayOfMonth: repeat.dates,
    byMonthOfYear: repeat.months,
    start: localDateToZonedDateTime(start)
  });
  return getNextOccurrenceFromRule(rule);
};

export const nextDateOfIteration = (
  repeat: Repeat,
  start: LocalDate
): LocalDate => {
  switch (repeat.type) {
    case "simple": {
      return nextDateOfIterationSimple(repeat, start);
    }
    case "weekly": {
      return nextDateOfIterationWeekly(repeat, start);
    }
    case "monthly": {
      return nextDateOfIterationMonthly(repeat, start);
    }
    default: {
      const never: never = repeat;
      throw new Error("Never error #2gRKWY");
    }
  }
};

export const getRepeatFromDate = (
  repeat: Repeat,
  byDate: LocalDate
): LocalDate => {
  if (repeat.repeat === EVERY) {
    return byDate;
  } else if (repeat.repeat === AFTER) {
    return LocalDate.now();
  } else {
    throw new Error("Unknown error. #8X711L");
  }
};

export const setNextByAndAfterDates = (task: Task) => {
  const repeatString = getKeyValue(REPEAT, task);
  if (repeatString.length === 0) {
    throw new Error(
      "Cannot calculate next iteration for task without repepat. #wjVJOL"
    );
  }

  const repeat = getRepeatParams(repeatString);

  const byDate = getDateField(BY, task);
  const afterString = getKeyValue(AFTER, task);

  const repeatFromDate = getRepeatFromDate(repeat, byDate);
  const nextByDate = nextDateOfIteration(repeat, repeatFromDate);

  const withNextByDate = setDateField(BY, nextByDate, task);

  if (afterString.length === 0) {
    return withNextByDate;
  }

  const afterDate = getDateField(AFTER, task);
  const daysBetweenAfterAndBy = afterDate.until(byDate);
  const nextAfterDate = nextByDate.minus(daysBetweenAfterAndBy);
  return setDateField(AFTER, nextAfterDate, task);
};

export const createNextRepetitionTask = (task: Task): Task => {
  return R.pipe(
    task,
    task => removeKeyValue(FINISHED, task),
    task => setNextByAndAfterDates(task),
    R.set("checked", false)
  );
};
