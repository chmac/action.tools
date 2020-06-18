import {
  getPackageState as getDomdState,
  isReady,
  PackageState as DomdState,
  startup as domdStartup,
} from "do.md";
import { writeToGit } from "./services/storage/actions/writeToGit.action";
import {
  getMarkdown,
  startup as storageStartup,
} from "./services/storage/storage.service";
import store from "./store";
import { init } from "./services/storage/actions/init.action";

const startup = async () => {
  await storageStartup();
  const markdown = await getMarkdown();
  await store.dispatch(domdStartup({ markdown }));

  // Initialise the storage state tree
  await store.dispatch(init());

  await store.dispatch(
    writeToGit({ commitMessage: "do.md: Transforms on startup" })
  );

  let lastState: DomdState;
  store.subscribe(() => {
    const state = store.getState();

    // Do nothing until the initial data load has finished
    if (!isReady(state)) {
      return;
    }

    const newState = getDomdState(state);

    if (lastState !== newState) {
      lastState = newState;

      store.dispatch(
        writeToGit({ commitMessage: "do.md: Saving update from redux" })
      );
    }
  });
};

startup().catch((error) => {
  console.error("Startup error #L9npO1", error);
  alert(`There was an error during startup. #p3eSJ7\n${error.message}`);
});
