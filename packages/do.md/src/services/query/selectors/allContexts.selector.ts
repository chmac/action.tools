import { RootState, getLocalState } from '../../../store';
import { createSelector } from '@reduxjs/toolkit';

export const allContexts = createSelector(
  [(rootState: RootState) => getLocalState(rootState).data.tasks],
  tasks => {
    const output = new Set<string>();
    tasks.forEach(task => {
      if (typeof task.data.contexts !== 'undefined') {
        task.data.contexts.forEach(context => {
          output.add(context);
        });
      }
    });
    return Array.from(output).sort();
  }
);
