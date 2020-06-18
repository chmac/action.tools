import { AppThunk } from "../../../store";
import { setLastCommitHash } from "../storage.state";
import { getLatestCommitHash } from "../storage.service";

export const init = (): AppThunk => async (dispatch, getState) => {
  const lastCommitHash = await getLatestCommitHash();
  dispatch(setLastCommitHash(lastCommitHash));
};
