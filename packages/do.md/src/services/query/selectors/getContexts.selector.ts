import { RootState, getLocalState } from '../../../store';
import { createSelector } from '@reduxjs/toolkit';
import { EXCLUDED_BY_DEFAULT_CONTEXTS } from '../../../constants';

export const getContexts = createSelector(
  [
    (rootState: RootState) => getLocalState(rootState).data.tasks,
    (rootState: RootState) => getLocalState(rootState).query.currentContexts,
  ],
  (tasks, currentContexts) => {
    const output = new Set<string>();
    tasks.forEach(task => {
      task.data.contexts?.forEach(context => {
        output.add(context);
      });
    });
    EXCLUDED_BY_DEFAULT_CONTEXTS.forEach(context => {
      output.add(context);
    });
    const allContexts = Array.from(output).sort();

    return allContexts.map((context): [string, boolean] => {
      const enabled = currentContexts.includes(context);
      return [context, enabled];
    });
  }
);
