import { AppThunk } from "../../../store";
import { debouncedPush } from "../storage.service";
import { resetCommitsAhead } from "../storage.state";

export const push = (): AppThunk => async (dispatch) => {
  await debouncedPush();

  // TODO - Figure out how to only run this after the *last* promise has
  // finished
  dispatch(resetCommitsAhead());
};
