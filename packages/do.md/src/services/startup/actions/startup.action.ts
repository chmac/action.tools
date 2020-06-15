import { AppThunk } from '../../../store';

export const startup = (): AppThunk => async (dispatch, getRootState) => {
  console.log('Root start on boot #bzvBIU', getRootState());
  dispatch({ type: 'startup/init' });
};
