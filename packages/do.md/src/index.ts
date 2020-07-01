import './services/startup/startup.service';

export { REDUX_ROOT_KEY as domdReduxKey } from './constants';
export {
  finishTask,
  newSection,
  newTask,
  setData,
  unfinishTask,
  addContextsToTask,
  snoozeTask,
} from './services/data/data.state';
export { getContexts } from './services/query/selectors/getContexts.selector';
export { isReady } from './services/query/selectors/isReady.selector';
export { sectionById } from './services/query/selectors/sectionById.selector';
export { sectionTitles } from './services/query/selectors/sectionTitles.selector';
export { selectActionableTodayFactory } from './services/query/selectors/selectActionableToday.selector';
export { selectCurrentContexts } from './services/query/selectors/selectCurrentContexts.selector';
export { selectTasks } from './services/query/selectors/selectTasks.selector';
export { selectTasksActionableInCurrentContexts } from './services/query/selectors/selectTasksActionableInCurrentContexts.selector';
export { selectTasksByDateFactory } from './services/query/selectors/selectTasksByDate.selector';
export { selectTasksByDatesFactory } from './services/query/selectors/selectTasksByDates.selector';
export { selectUndatedTasks } from './services/query/selectors/selectUndatedTasks.selector';
export { selectUnfinishedTasks } from './services/query/selectors/selectUnfinishedTasks.selector';
export { taskById } from './services/query/selectors/taskById.selector';
export { taskWithContext } from './services/query/selectors/taskWithContext.selector';

export {
  setCurrentContexts,
  addContext,
  removeContext,
} from './services/query/query.state';

export {
  createNextIteration,
  getRepeatParams,
} from './services/repeat/repeat.service';
export { parseMdast } from './services/parser/parser.service';
export { startup } from './services/startup/actions/startup.action';
export { createMdast } from './services/unparser/unparser.service';
export {
  reducer,
  getLocalState as getPackageState,
  LocalState as PackageState,
} from './store';
export * from './types';

export * as constants from './constants';

export { createId, stringifyDayjs } from './utils';

/**
 * # Update to redux based data model
 *
 * - Convert a string / buffer into an mdast
 * - Convert mdast into a redux datastore
 * - Perform operations
 *   - There are filtering / transforms already built
 *   - Duplicate repeated tasks
 *   - Add task IDs
 *   - Convert date shortcuts (today -> 2020-02-24)
 * - Render redux -> mdast
 * - mdast to string
 *
 * What does the API look like?
 *
 * Redux actions
 *
 * - loadTasksFromMarkdown = (markdown: string): Promise<void>
 * - createNewTask
 * - updateTask
 * - markTaskFinished
 *
 * Directly callable APIs
 * - applyTransforms = (markdown: string, transforms: {}): Promise<string>
 *
 * # Data model
 *
 * sections
 *   - id
 *   - order
 *   - title
 *   - depth
 *   - body
 * tasks
 *   - id
 *   - text
 *   - data
 *   - sectionId
 *   - parentTaskId
 *   - depth
 */

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};
