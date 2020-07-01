import { createSelector } from '@reduxjs/toolkit';
import { Task } from '../../../types';
import { selectTasks } from './selectTasks.selector';

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

export const selectUndatedTasks = createSelector([selectTasks], (tasks) => {
  return tasks.filter(isTaskUndated);
});
