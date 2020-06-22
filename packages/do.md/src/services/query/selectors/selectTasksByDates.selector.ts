import { createSelector } from '@reduxjs/toolkit';
import { Task } from '../../../types';
import { doesTaskMatchDate } from '../query.service';
import { selectCurrentContexts } from './selectCurrentContexts.selector';
import { selectTasks } from './selectTasks.selector';

export const selectTasksByDatesFactory = (dates: string[]) =>
  createSelector(
    [() => dates, selectCurrentContexts, selectTasks],
    (dates, currentContexts, tasks) => {
      // Build an object like {[date1]: [], [date2]: []}
      const input = Object.fromEntries(
        // NOTE: We need to explicitly type the return signature of the map()
        // iterator so that typescript knows what the result looks like.
        dates.map((date): [string, Task[]] => [date, []])
      );

      return tasks.reduce((output, task) => {
        // NOTE: A task might match more than 1 date
        const matchedDates = dates.filter(date => {
          return doesTaskMatchDate({
            task,
            date,
            currentContexts,
          });
        });

        if (matchedDates.length === 0) {
          return output;
        }

        return matchedDates.reduce((obj, date) => {
          return { ...obj, [date]: obj[date].concat(task) };
        }, output);
      }, input);
    }
  );
