import dayjs from 'dayjs';
import { Task } from '../../types';
import { intersection } from 'remeda';

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
  /**
   * - Exclude by context
   * - Exclude if sequential and not next in the sequence
   * - Exclude by dates if they exist
   *   - snoozed
   *   - after
   */
  // A task that has already been completed is never actionable
  if (task.finished) {
    return false;
  }

  if (
    typeof contexts !== 'undefined' &&
    contexts.length > 0 &&
    currentContexts.length > 0
  ) {
    const matchedContexts = intersection(contexts, currentContexts);
    if (matchedContexts.length === 0) {
      return false;
    }
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
