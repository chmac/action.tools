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
import { getKeyValue, stringToLocalDate } from "./utils";
import { EVERY, AFTER } from "./constants";

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

export const calculateNextIteration = (task: Task) => {
  const repeatString = getKeyValue("repeat", task);
  if (repeatString.length === 0) {
    throw new Error(
      "Cannot calculate next ieration for task without repepat. #wjVJOL"
    );
  }

  const repeat = getRepeatParams(repeatString);

  if (repeat.repeat === EVERY) {
    // Repeat after the last due date
    const due = getKeyValue("due", task);
    const dueDate = stringToLocalDate(due);
    const nextDueDate = nextDateOfIteration(repeat, dueDate);
  } else if (repeat.repeat === AFTER) {
    // Repeat after the completion date
    const today = LocalDate.now(); // Hack, use the current time for now
    const nextDueDate = nextDateOfIteration(repeat, today);
  } else {
    throw new Error("Unknown error. #8X711L");
  }
};
