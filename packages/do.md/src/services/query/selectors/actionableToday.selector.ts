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
      return tasks.filter(task =>
        isTaskActionableToday({
          task,
          today,
          currentContexts,
        })
      );
    }
  );
};
