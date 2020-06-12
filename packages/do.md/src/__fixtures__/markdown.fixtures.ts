import { Root } from 'mdast';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import unified from 'unified';
import { Node, Parent } from 'unist';

export type NodeWithData = Node & { _data: { [prop: string]: any } };

const toMdastProcessor = unified().use(markdown, { gfm: true });
const toMarkdownProcessor = unified().use(stringify, {
  listItemIndent: '1',
});

export const markdownToMdast = (text: string): Parent => {
  return toMdastProcessor.parse(text) as Root;
};

export const mdastToMarkdown = async (tree: Root): Promise<string> => {
  return toMarkdownProcessor.stringify(tree);
};

export const taskListOnly = `- [ ] A simple task
- [ ] A second simple task
- [ ] One more simple task`;
