import { createSelector } from '@reduxjs/toolkit';
import { isTaskUndated } from '../query.service';
import { selectTasksActionableInCurrentContexts } from './selectTasksActionableInCurrentContexts.selector';

export const selectUndatedTasks = createSelector(
  [selectTasksActionableInCurrentContexts],
  (tasks) => {
    return tasks.filter(isTaskUndated);
  }
);
