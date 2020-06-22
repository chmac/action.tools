import { RootState, getLocalState } from '../../../store';

export const selectCurrentContexts = (rootState: RootState) =>
  getLocalState(rootState).query.currentContexts;
