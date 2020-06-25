import dayjs from 'dayjs';
import { REPEAT_ID_SEPARATOR } from '../../constants';
import { Repeat, Task, TaskData } from '../../types';
import { createId, stringifyDayjs } from '../../utils';
import { nextDateOfIterationAfterToday } from './services/nextRepeat/nextRepeat.service';
import { getRepeatParams } from './services/repeatParser/repeatParser.service';

/**
 * Given an id like abc123 create abc123-1, given abc123-1 create abc123-2
 */
export const _calculateNextTaskId = (id?: string): string => {
  if (typeof id === 'undefined') {
    return createId();
  }
  const [baseId, counter] = id.split(REPEAT_ID_SEPARATOR);
  if (typeof counter === 'undefined') {
    // NOTE: We start with 1, assuming the naked baseId is the 0 value
    return `${baseId}-1`;
  }
  const asInt = parseInt(counter);
  return `${baseId}-${(asInt + 1).toString()}`;
};

export const _calculateNextRepetitionDate = ({
  date,
  today,
  repeat,
}: {
  date: string;
  today: string;
  repeat: Repeat;
}): string => {
  console.log(date, today, repeat, '#djXndF');
  return '';
};

export const _calculateNextByAfterDates = ({
  by,
  after,
  today,
  repeat,
}: {
  by?: string;
  after?: string;
  today: string;
  repeat: Repeat;
}) => {
  // If this task has no BY date, then just extend the AFTER date with the
  // regular repeat logic and we're done.
  if (typeof by === 'undefined') {
    if (typeof after === 'undefined') {
      throw new Error('Unexpected error. #U3GWXo');
    }
    const nextAfter = nextDateOfIterationAfterToday({
      repeat,
      start: after,
      today,
    });
    return { after: nextAfter };
  }

  const nextBy = nextDateOfIterationAfterToday({ repeat, start: by, today });

  // If there is both a BY and an AFTER date, then having already calculated the
  // value of the next BY date, calculate the next AFTER date. Do that by
  // counting the number of days between the original BY and AFTER dates, and
  // deducting that many days from the new BY date.
  if (typeof after !== 'undefined') {
    const daysFromAfterUntilBy = dayjs(by).diff(after, 'day');
    const nextAfter = stringifyDayjs(
      dayjs(nextBy).subtract(daysFromAfterUntilBy, 'day')
    );
    return { by: nextBy, after: nextAfter };
  }

  return { by: nextBy };
};

/**
 * Given a task that **is finished**, and today's date, return the next
 * repetition of this task.
 */
export const createNextIteration = ({
  task,
  today,
}: {
  task: Task;
  today: string;
}): Task => {
  if (typeof task.data.repeat === 'undefined') {
    throw new Error('Invalid task given to createNextIteration() #ONv7Lt');
  }

  const repeat = getRepeatParams(task.data.repeat);

  const dates = _calculateNextByAfterDates({
    by: task.data.by,
    after: task.data.after,
    today,
    repeat,
  });

  const id = _calculateNextTaskId(task.data.id);

  const data: TaskData = {
    id,
    repeat: task.data.repeat,
    created: stringifyDayjs(dayjs(today)),
    ...dates,
  };

  return {
    ...task,
    finished: false,
    id,
    data,
  };
};
