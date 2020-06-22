import { RootState, getLocalState } from '../../../store';

export const selectTasks = (rootState: RootState) =>
  getLocalState(rootState).data.tasks;
