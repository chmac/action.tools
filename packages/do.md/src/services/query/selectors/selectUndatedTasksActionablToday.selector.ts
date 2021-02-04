import { createSelector } from '@reduxjs/toolkit';
import { isTaskUndated } from '../query.service';
import { selectActionableTodayFactory } from './selectActionableToday.selector';

export const selectUndatedTasksActionableToday = createSelector(
  [selectActionableTodayFactory()],
  (tasks) => {
    return tasks.filter(isTaskUndated);
  }
);
