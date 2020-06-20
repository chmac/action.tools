import { createSelector } from '@reduxjs/toolkit';
import { getLocalState, RootState } from '../../../store';
import { isTaskActionableToday } from '../query.service';

export const makeActionableTodaySelector = () => {
  return createSelector(
    [
      (state: RootState) => getLocalState(state).query.today,
      (state: RootState) => getLocalState(state).query.currentContexts,
      (state: RootState) => getLocalState(state).data.tasks,
    ],
    (today, currentContexts, tasks) => {
      return tasks.filter(task => {
        // If this task has actionable children, then consider it is not
        // "actionable" today, the children must be completed first. This is a
        // slightly weird dependency decision, and might need revisited, because
        // after the children are completed, the parent becomes available.
        // TODO Figure out how to handle child / parent tasks
        const { id } = task;
        if (
          typeof tasks.find(
            task => task.parentId === id && task.isTask && !task.finished
          ) !== 'undefined'
        ) {
          return false;
        }

        return isTaskActionableToday({
          task,
          today,
          currentContexts,
        });
      });
    }
  );
};
