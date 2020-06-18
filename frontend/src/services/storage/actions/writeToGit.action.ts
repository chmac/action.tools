import { AppThunk } from "../../../store";
import { push } from "./push.action";
import { addCommitsAhead, setLastCommitHash } from "../storage.state";
import { createMdast, getPackageState as getDomdState } from "do.md";
import { mdastToMarkdown } from "../../mdast/mdast.service";
import { setMarkdown } from "../storage.service";

export const writeToGit = ({
  commitMessage = "do.md: Saving update from redux",
}: {
  commitMessage?: string;
} = {}): AppThunk => async (dispatch, getState) => {
  const domdState = getDomdState(getState());

  const { sections, tasks } = domdState.data;
  const mdast = createMdast({ sections, tasks });
  const markdown = await mdastToMarkdown(mdast);

  const response = await setMarkdown({
    markdown,
    commitMessage,
  });

  if (response.result === "committed") {
    dispatch(addCommitsAhead(1));
    dispatch(setLastCommitHash(response.newCommitHash));
    dispatch(push());
  }
};
