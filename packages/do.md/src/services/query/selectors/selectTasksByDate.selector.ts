import { createSelector } from '@reduxjs/toolkit';
import { doesTaskMatchDate } from '../query.service';
import { selectCurrentContexts } from './selectCurrentContexts.selector';
import { selectTasks } from './selectTasks.selector';

export const selectTasksByDateFactory = (date: string) =>
  createSelector(
    [() => date, selectCurrentContexts, selectTasks],
    (date, currentContexts, tasks) => {
      return tasks.filter(task =>
        doesTaskMatchDate({
          task,
          date,
          currentContexts,
        })
      );
    }
  );
