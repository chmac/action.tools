import * as R from "remeda";
import { LocalDate, ZonedDateTime, ZoneOffset, LocalTime } from "@js-joda/core";

import {
  Task,
  Repeat,
  RepeatSimple,
  RepeatWeekly,
  RepeatMonthly,
} from "./types";
import { Rule } from "./rschedule";
import { getRepeatFromTaskOrThrow } from "./repeat";
import { getKeyValue, removeKeyValue, hasKeyValue } from "./utils";
import { setDateField, getDateField } from "./dates";
import { EVERY, AFTER, BY, FINISHED } from "./constants";

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
  } else if (unit === "year") {
    return start.plusYears(count);
  }
  return notReachable(unit);
};

export const getNextOccurrenceFromRule = (
  rule: Rule,
  start: LocalDate
): LocalDate => {
  const [first, second] = rule.occurrences({ take: 2 }).toArray();

  const firstDate = LocalDate.from(first.date);
  // The first date created by the rule might be the same as the `start` date.
  // In that case we did not find the "next" iteration.
  if (firstDate.isAfter(start)) {
    return firstDate;
  }

  const secondDate = LocalDate.from(second.date);
  return secondDate;
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
    start: localDateToZonedDateTime(start),
  });
  return getNextOccurrenceFromRule(rule, start);
};

export const nextDateOfIterationMonthly = (
  repeat: RepeatMonthly,
  start: LocalDate
): LocalDate => {
  const rule = new Rule({
    frequency: "YEARLY",
    byDayOfMonth: repeat.dates,
    byMonthOfYear: repeat.months,
    start: localDateToZonedDateTime(start),
  });
  return getNextOccurrenceFromRule(rule, start);
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
  const first = next;

  while (!next.isAfter(today)) {
    next = nextDateOfIteration(repeat, next);

    // NOTE: There is a potential to reach an infinite loop here if the returned
    // date is the same as the current date. This was an issue because
    // `nextDateOfIteration()` was not always returning a date which was after
    // its provided `start` date.
    if (next.isEqual(first)) {
      throw new Error("Recursive loop encountered. #l2OWKV");
    }
  }

  return next;
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
  const repeat = getRepeatFromTaskOrThrow(task);

  // If this task has no BY date, then just extend the AFTER date with the
  // regular repeat logic and we're done.
  if (!hasKeyValue(BY, task)) {
    if (!hasKeyValue(AFTER, task)) {
      throw new Error(
        "Cannot repeat a task with neither AFTER or BY dates. #S5Bt0W"
      );
    }

    const after = getDateField(AFTER, task);
    const nextAfterDate = nextDateOfIterationAfterToday(repeat, after, today);
    const withNextAfterDate = setDateField(AFTER, nextAfterDate, task);

    return withNextAfterDate;
  }

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
    (task) => removeKeyValue(FINISHED, task),
    (task) => setNextByAndAfterDates(task, today),
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
