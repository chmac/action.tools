import dayjs, { Dayjs } from 'dayjs';
import { Rule } from '../../../../rschedule';
import {
  Repeat,
  RepeatMonthly,
  RepeatSimple,
  RepeatWeekly,
} from '../../../../types';
import { stringifyDayjs } from '../../../../utils';

const notReachable = (_x: never): never => {
  throw new Error('Unknown never error. #gqIMjG');
};

export const nextDateOfIterationSimple = ({
  repeat,
  start,
}: {
  repeat: RepeatSimple;
  start: Dayjs;
}): Dayjs => {
  const { count, unit } = repeat;
  return start.add(count, unit);
};

export const getNextOccurrenceFromRule = ({
  rule,
  start,
}: {
  rule: Rule;
  start: Dayjs;
}): Dayjs => {
  const [first, second] = rule.occurrences({ take: 2 }).toArray();

  const firstDate = first.date;
  // The first date created by the rule might be the same as the `start` date.
  // In that case we did not find the "next" iteration.
  if (firstDate.isAfter(start)) {
    return firstDate;
  }

  return second.date;
};

export const nextDateOfIterationWeekly = ({
  repeat,
  start,
}: {
  repeat: RepeatWeekly;
  start: Dayjs;
}): Dayjs => {
  const rule = new Rule({
    frequency: 'WEEKLY',
    byDayOfWeek: repeat.days,
    start,
  });
  return getNextOccurrenceFromRule({ rule, start });
};

export const nextDateOfIterationMonthly = ({
  repeat,
  start,
}: {
  repeat: RepeatMonthly;
  start: Dayjs;
}): Dayjs => {
  const rule = new Rule({
    frequency: 'YEARLY',
    byDayOfMonth: repeat.dates,
    byMonthOfYear: repeat.months,
    start,
  });
  return getNextOccurrenceFromRule({ rule, start });
};

export const nextDateOfIteration = ({
  repeat,
  start: startString,
}: {
  repeat: Repeat;
  start: string;
}): string => {
  const start = dayjs(startString);

  switch (repeat.type) {
    case 'simple': {
      const result = nextDateOfIterationSimple({ repeat, start });
      return stringifyDayjs(result);
      // return stringifyDayjs(nextDateOfIterationSimple({ repeat, start }));
    }
    case 'weekly': {
      return stringifyDayjs(nextDateOfIterationWeekly({ repeat, start }));
    }
    case 'monthly': {
      return stringifyDayjs(nextDateOfIterationMonthly({ repeat, start }));
    }
  }
  return notReachable(repeat);
};

export const nextDateOfIterationAfterToday = ({
  repeat,
  start,
  today,
}: {
  repeat: Repeat;
  start: string;
  today: string;
}): string => {
  const todayDayjs = dayjs(today);
  let next = nextDateOfIteration({ repeat, start });
  const first = next;

  while (!dayjs(next).isAfter(todayDayjs)) {
    next = nextDateOfIteration({ repeat, start: next });

    // NOTE: There is a potential to reach an infinite loop here if the returned
    // date is the same as the current date. This was an issue because
    // `nextDateOfIteration()` was not always returning a date which was after
    // its provided `start` date.
    if (next === first) {
      throw new Error('Recursive loop encountered. #l2OWKV');
    }
  }

  return next;
};
