import './services/startup/startup.service';
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
