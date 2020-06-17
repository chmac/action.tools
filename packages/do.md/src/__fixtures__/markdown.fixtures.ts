import { Root } from 'mdast';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import { Node } from 'unist';
import { AFTER, BY, KEY_VALUE_SEPARATOR } from '../constants';
import { TaskListItem } from '../types';

export type NodeWithData = Node & { _data: { [prop: string]: any } };

const toMdastProcessor = unified().use(markdown, { gfm: true });
const toMarkdownProcessor = unified().use(stringify, {
  listItemIndent: '1',
  incrementListMarker: false,
});

export const markdownToMdast = (text: string): Root => {
  return toMdastProcessor.parse(text) as Root;
};

export const mdastToMarkdown = async (tree: Root): Promise<string> => {
  return toMarkdownProcessor.stringify(tree);
};

export const getFirstTaskFromMdast = (root: Root): TaskListItem => {
  return (root as any).children[0].children[0];
};

const yesterday = '2020-02-23';
const today = '2020-02-24';
const tomorrow = '2020-02-25';
const data = (key: string, value: string) =>
  `\`${key}${KEY_VALUE_SEPARATOR}${value}\``;

export const taskListOnlyMarkdown = `- [ ] A simple task
- [ ] A second simple task
- [ ] One more simple task`;

export const tasksWithSecondLineMarkdown = `- [ ] A first task  
  With a second line of text
- [ ] A second task without a second line`;

export const complexTaskListMarkdown = `# First heading

- [ ] A top level task  
  ${data(AFTER, yesterday)} ${data(BY, today)} ${data('id', 'abc123')}
- [ ] A second task  
  ${data(AFTER, '2020-01-01')} ${data(BY, tomorrow)}

## Sub heading

Some text under the second heading.

- [ ] Third task  
  ${data(AFTER, yesterday)} ${data(BY, tomorrow)}
- [ ] Fourth task on the list  
  ${data(AFTER, '2020-01-01')} ${data(BY, today)}
  - [ ] Nested task first
  - [ ] Second nested task

More text without a heading.

1. [ ] A sequential task
1. [ ] A second sequential task
`;

const singleTask = markdownToMdast(`- [ ] A single task`);
export const taskWithoutData = singleTask.children[0] as TaskListItem;

const singleTaskWithSecondLine = markdownToMdast(
  `- [ ] A second line task task  \nWith a second line`
);
export const taskWithSecondLine = singleTaskWithSecondLine
  .children[0] as TaskListItem;
