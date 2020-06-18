import { AppThunk } from "../../../store";
import { debouncedPush } from "../storage.service";
import { resetCommitsAhead } from "../storage.state";

export const push = (): AppThunk => async (dispatch) => {
  await debouncedPush();

  dispatch(resetCommitsAhead());
};
