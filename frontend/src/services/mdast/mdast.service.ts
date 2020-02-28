import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { Node, Parent } from "unist";

export type NodeWithData = Node & { _data: { [prop: string]: any } };

const toMdastProcessor = unified().use(markdown, { gfm: true });
const toMarkdownProcessor = unified().use(stringify, {
  listItemIndent: "1"
});

export const markdownToMdast = (text: string): Parent => {
  return toMdastProcessor.parse(text) as Parent;
};

export const mdastToMarkdown = async (tree: Parent): Promise<string> => {
  return toMarkdownProcessor.stringify(tree);
};
