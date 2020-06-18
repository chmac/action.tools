import { RootState, getLocalState } from '../../../store';

/**
 * Check all parts of the state to see if all required startup actions have
 * been run.
 */
export const isReady = (rootState: RootState) => {
  const state = getLocalState(rootState);
  return state.data.initialDataLoadComplete && state.query.today !== '';
};
