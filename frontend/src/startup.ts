import { startup as domdStartup, createMdast } from "do.md";
import {
  getMarkdown,
  startup as storageStartup,
  setMarkdown,
} from "./services/storage/storage.service";
import store, { AppState } from "./store";
import { mdastToMarkdown } from "./services/mdast/mdast.service";

// We use this to try and ensure only 1 operation runs at a time
let block = false;

const setMarkdownFromReduxState = async (
  state: AppState["__domd"],
  commitMessage?: string
) => {
  if (block === true) {
    console.log("blocked, calling setTimeout #CRm6Yn");
    setTimeout(() => setMarkdownFromReduxState(state), 30);
    return;
  }
  block = true;
  const { sections, tasks } = state.data;
  const mdast = createMdast({ sections, tasks });
  const markdown = await mdastToMarkdown(mdast);

  await setMarkdown({ markdown, commitMessage });

  block = false;
};

const startup = async () => {
  await storageStartup();
  const markdown = await getMarkdown();
  await store.dispatch(domdStartup({ markdown }));

  // After successful startup, try writing the markdown immediately, to ensure
  // that we separate any transforms from operations carried out by the user.
  await setMarkdownFromReduxState(
    store.getState().__domd,
    "Transforms on startup"
  );

  let lastState: AppState["__domd"];
  store.subscribe(() => {
    const state = store.getState();

    // Do nothing until the initial data load has finished
    if (!state.__domd.startup.initialDataLoadFinished) {
      return;
    }
    const newState = state["__domd"];

    if (lastState !== newState) {
      lastState = newState;
      setMarkdownFromReduxState(newState);
    }
  });
};

startup().catch((error) => {
  console.error("Startup error #L9npO1", error);
  alert(`There was an error during startup. #p3eSJ7\n${error.message}`);
});
