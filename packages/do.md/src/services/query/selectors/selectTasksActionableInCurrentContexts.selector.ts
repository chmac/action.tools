import { createSelector } from '@reduxjs/toolkit';
import { isTaskActionableInCurrentContexts } from '../query.service';
import { selectCurrentContexts } from './selectCurrentContexts.selector';
import { selectUnfinishedTasks } from './selectUnfinishedTasks.selector';

export const selectTasksActionableInCurrentContexts = createSelector(
  [selectUnfinishedTasks, selectCurrentContexts],
  (tasks, currentContexts) => {
    return tasks.filter((task) =>
      isTaskActionableInCurrentContexts({
        contexts: task.data.contexts,
        currentContexts,
      })
    );
  }
);
