import { startup as domdStartup, createMdast } from "do.md";
import {
  getMarkdown,
  startup as storageStartup,
  setMarkdown,
} from "./services/storage/storage.service";
import store, { AppState } from "./store";
import { mdastToMarkdown } from "./services/mdast/mdast.service";

const startup = async () => {
  await storageStartup();
  const markdown = await getMarkdown();
  await store.dispatch(domdStartup({ markdown }));

  let lastState: AppState["__domd"];
  store.subscribe(async () => {
    const state = store.getState();

    // Do nothing until the initial data load has finished
    if (!state.__domd.startup.initialDataLoadFinished) {
      return;
    }
    const newState = state["__domd"];

    if (lastState !== newState) {
      lastState = newState;
      const { sections, tasks } = newState.data;
      debugger;
      const mdast = createMdast({ sections, tasks });
      const markdown = await mdastToMarkdown(mdast);
      debugger;
      setMarkdown(markdown);
    }
  });
};

startup().catch((error) => {
  console.error("Startup error #L9npO1", error);
  alert(`There was an error during startup. #p3eSJ7\n${error.message}`);
});
