import dayjs from 'dayjs';
import { REPEAT_ID_SEPARATOR } from '../../constants';
import { Repeat, Task, TaskData } from '../../types';
import { createId, stringifyDayjs } from '../../utils';
import { nextDateOfIterationAfterToday } from './services/nextRepeat/nextRepeat.service';
import { getRepeatParams } from './services/repeatParser/repeatParser.service';

/**
 * Given an id like abc123 create abc123-1, given abc123-1 create abc123-2
 */
export const calculateNextTaskId = (id?: string): string => {
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

export const calculateNextRepetitionDate = ({
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

export const calculateNextByAfterDates = ({
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

  if (typeof after !== 'undefined') {
    const afterDayjs = dayjs(after);
    const byDayjs = dayjs(by);
    const afterNumberOfDaysBeforeBy = afterDayjs.diff(byDayjs, 'day');
    const nextAfter = stringifyDayjs(
      dayjs(nextBy).subtract(afterNumberOfDaysBeforeBy, 'day')
    );
    return { by: nextBy, after: nextAfter };
  }

  return { by: nextBy };
};

/**
 * Given a task, and today's date, return the next repetition of this task.
 */
export const createNextIteration = ({
  task,
  today,
}: {
  task: Task;
  today: string;
}) => {
  if (typeof task.data.repeat === 'undefined') {
    throw new Error('Invalid task given to createNextIteration() #ONv7Lt');
  }

  const repeat = getRepeatParams(task.data.repeat);

  const dates = calculateNextByAfterDates({
    by: task.data.by,
    after: task.data.after,
    today,
    repeat,
  });

  const data: TaskData = {
    id: calculateNextTaskId(task.data.id),
    repeat: task.data.repeat,
    created: stringifyDayjs(dayjs(today)),
    ...dates,
  };

  return { repeat, data, today };
};
