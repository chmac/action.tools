import { createSelector } from '@reduxjs/toolkit';
import { isTaskUnfinished } from '../query.service';
import { selectTasks } from './selectTasks.selector';

export const selectUnfinishedTasks = createSelector([selectTasks], (tasks) => {
  return tasks.filter(isTaskUnfinished);
});
