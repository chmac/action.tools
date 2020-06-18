import dayjs from 'dayjs';
import { Task } from '../../types';
import { intersection, difference } from 'remeda';
import { EXCLUDED_BY_DEFAULT_CONTEXTS } from '../../constants';

export const isSnoozed = ({
  snooze,
  today,
}: {
  snooze: string;
  today: string;
}): boolean => {
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

  if (typeof snooze === 'string') {
    if (isSnoozed({ snooze, today })) {
      return false;
    }
  }

  if (typeof after === 'string') {
    if (isBlockedByAfterDate({ after, today })) {
      return false;
    }
  }

  return true;
};
