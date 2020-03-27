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
import { getKeyValue, removeKeyValue } from "./utils";
import { setDateField, getDateField, isTodayOrInTheFuture } from "./dates";
import { EVERY, AFTER, REPEAT, BY, FINISHED } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notReachable = (_x: never): never => {
  throw new Error("Unknown never error. #m3lX5k");
};

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
  }
  return notReachable(unit);
};

export const getNextOccurrenceFromRule = (rule: Rule): LocalDate => {
  const [next] = rule.occurrences({ take: 1 }).toArray();

  return LocalDate.from(next.date);
};

export const localDateToZonedDateTime = (start: LocalDate): ZonedDateTime => {
  return ZonedDateTime.of(start, LocalTime.of(), ZoneOffset.UTC);
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
  }
  return notReachable(repeat);
};

export const nextDateOfIterationAfterToday = (
  repeat: Repeat,
  start: LocalDate,
  today: LocalDate
): LocalDate => {
  let next = nextDateOfIteration(repeat, start);

  while (!next.isAfter(today)) {
    next = nextDateOfIteration(repeat, next);
  }

  return next;
  throw new Error("Yet to implement recursion #ORv2EF");
};

export const getRepeatFromDate = (
  repeat: Repeat,
  byDate: LocalDate,
  today: LocalDate
): LocalDate => {
  switch (repeat.repeat) {
    case EVERY: {
      return byDate;
    }
    case AFTER: {
      return today;
    }
  }
  return notReachable(repeat);
};

export const setNextByAndAfterDates = (task: Task, today: LocalDate): Task => {
  const repeatString = getKeyValue(REPEAT, task);
  if (repeatString.length === 0) {
    throw new Error(
      "Cannot calculate next iteration for task without repepat. #wjVJOL"
    );
  }

  const repeat = getRepeatParams(repeatString);

  const byDate = getDateField(BY, task);
  const afterString = getKeyValue(AFTER, task);

  const repeatFromDate = getRepeatFromDate(repeat, byDate, today);
  const nextByDate = nextDateOfIterationAfterToday(
    repeat,
    repeatFromDate,
    today
  );

  const withNextByDate = setDateField(BY, nextByDate, task);

  if (afterString.length === 0) {
    return withNextByDate;
  }

  const afterDate = getDateField(AFTER, task);
  const daysBetweenAfterAndBy = afterDate.until(byDate);
  const nextAfterDate = nextByDate.minus(daysBetweenAfterAndBy);
  return setDateField(AFTER, nextAfterDate, task);
};

export const createNextRepetitionTask = (
  task: Task,
  today: LocalDate
): Task => {
  return R.pipe(
    task,
    task => removeKeyValue(FINISHED, task),
    task => setNextByAndAfterDates(task, today),
    R.set("checked", false)
  );
};

export const calculateNextIteration = (
  task: Task,
  today: LocalDate
): Task[] => {
  const nextTask = createNextRepetitionTask(task, today);
  const taskWithFinished = setDateField(FINISHED, today, task);
  return [nextTask, taskWithFinished];
};
