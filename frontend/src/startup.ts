import {
  createMdast,
  getPackageState as getDomdState,
  PackageState as DomdState,
  startup as domdStartup,
} from "do.md";
import { mdastToMarkdown } from "./services/mdast/mdast.service";
import {
  getMarkdown,
  setMarkdown,
  startup as storageStartup,
} from "./services/storage/storage.service";
import store from "./store";

// We use this to try and ensure only 1 operation runs at a time
let block = false;

const setMarkdownFromReduxState = async (
  state: DomdState,
  commitMessage = "do.md: Saving update from redux"
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
    getDomdState(store.getState()),
    "do.md: Transforms on startup"
  );

  let lastState: DomdState;
  store.subscribe(() => {
    const state = store.getState();

    const newState = getDomdState(state);

    // Do nothing until the initial data load has finished
    if (!newState.data.initialDataLoadComplete) {
      return;
    }

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
