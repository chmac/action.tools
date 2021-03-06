import dayjs from 'dayjs';
import { Task } from '../../types';
import { intersection, difference } from 'remeda';
import { EXCLUDED_BY_DEFAULT_CONTEXTS } from '../../constants';

export const isTaskUnfinished = (task: Task) => {
  return !task.finished;
};

export const isSnoozed = ({
  snooze,
  today,
}: {
  snooze: string;
  today: string;
}): boolean => {
  // NOTE: dayjs('').isAfter or isBefore always returns false, passing an empty
  // string to dayjs() generates an invalid date.
  return dayjs(snooze).isAfter(today);
};

export const isBlockedByAfterDate = ({
  after,
  today,
}: {
  after: string;
  today: string;
}): boolean => {
  return dayjs(after).isAfter(today);
};

export const isTaskActionableInCurrentContexts = ({
  contexts,
  currentContexts,
}: {
  contexts?: string[];
  currentContexts: string[];
}) => {
  // If the task has no contexts, then it's automatically actionable in all
  if (typeof contexts === 'undefined' || contexts.length === 0) {
    return true;
  }

  // Check if any contexts cause this task to be excluded (eg: @someday)
  const excludeContexts = difference(
    EXCLUDED_BY_DEFAULT_CONTEXTS,
    currentContexts
  );
  const matchedExclusions = intersection(excludeContexts, contexts);
  if (matchedExclusions.length > 0) {
    return false;
  }

  // After handling exclusions (like @someday), if there are no OTHER contexts
  // in `currentContexts`, then all tasks match, so return true now.
  const includeContexts = difference(
    currentContexts,
    EXCLUDED_BY_DEFAULT_CONTEXTS
  );
  if (includeContexts.length === 0) {
    return true;
  }

  // Get all the contexts which are in currentContexts
  const matchedContexts = intersection(contexts, currentContexts);
  if (matchedContexts.length > 0) {
    return true;
  }
  return false;
};

export const isTaskActionableToday = ({
  task,
  today,
  currentContexts,
}: {
  task: Task;
  today: string;
  currentContexts: string[];
}): boolean => {
  const { data } = task;
  const { contexts, snooze, after } = data;

  // A task that has already been completed is never actionable
  if (task.finished) {
    return false;
  }

  if (!isTaskActionableInCurrentContexts({ contexts, currentContexts })) {
    return false;
  }

  if (task.isSequential) {
    // TODO Figure out how to handle sequential tasks
    // For now, we ignore the isSequential field, and only validate based on
    // other fields
  }

  if (typeof snooze === 'string' && snooze.length > 0) {
    if (isSnoozed({ snooze, today })) {
      return false;
    }
  }

  if (typeof after === 'string' && after.length > 0) {
    if (isBlockedByAfterDate({ after, today })) {
      return false;
    }
  }

  return true;
};

export const doesTaskMatchDate = ({
  task,
  date,
  currentContexts,
}: {
  task: Task;
  date: string;
  currentContexts: string[];
}) => {
  const { data } = task;
  const { contexts, after, by, snooze } = data;

  // A task that has already been completed is never actionable
  if (task.finished) {
    return false;
  }

  if (!isTaskActionableInCurrentContexts({ contexts, currentContexts })) {
    return false;
  }

  if (task.isSequential) {
    // TODO Figure out how to handle sequential tasks
    // For now, we ignore the isSequential field, and only validate based on
    // other fields
  }

  if (typeof by === 'string') {
    // NOTE: String comparison works here, both by and date are strings
    // representing the date, no need for a date library to compare
    if (by === date) {
      return true;
    }
  }

  if (typeof snooze === 'string') {
    // NOTE: String comparison works here, both by and date are strings
    // representing the date, no need for a date library to compare
    if (snooze === date) {
      return true;
    }
    // Only check the `after` date if a `snoozze` date does not exist. We assume
    // that a snooze date will always be later than an `after` date.
  } else if (typeof after === 'string') {
    // NOTE: String comparison works here, both by and date are strings
    // representing the date, no need for a date library to compare
    if (after === date) {
      return true;
    }
  }

  return false;
};

export const isTaskUndated = (task: Task): boolean => {
  const { data } = task;
  if (typeof data.after !== 'undefined') {
    return false;
  }
  if (typeof data.by !== 'undefined') {
    return false;
  }
  return true;
};
