import { ListItem, Root } from 'mdast';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import { Node } from 'unist';

export type NodeWithData = Node & { _data: { [prop: string]: any } };

const toMdastProcessor = unified().use(markdown, { gfm: true });
const toMarkdownProcessor = unified().use(stringify, {
  listItemIndent: '1',
});

export const markdownToMdast = (text: string): Root => {
  return toMdastProcessor.parse(text) as Root;
};

export const mdastToMarkdown = async (tree: Root): Promise<string> => {
  return toMarkdownProcessor.stringify(tree);
};

export const getFirstTaskFromMdast = (root: Root): ListItem => {
  return (root as any).children[0].children[0];
};

export const taskListOnly = `- [ ] A simple task
- [ ] A second simple task
- [ ] One more simple task`;

export const tasksWithSecondLine = `- [ ] A first task  
  With a second line of text
- [ ] A second task without a second line`;

const singleTask = markdownToMdast(`- [ ] A single task`);
export const taskWithoutData = singleTask.children[0] as ListItem;

const singleTaskWithSecondLine = markdownToMdast(
  `- [ ] A second line task task  \nWith a second line`
);
export const taskWithSecondLine = singleTaskWithSecondLine
  .children[0] as ListItem;
