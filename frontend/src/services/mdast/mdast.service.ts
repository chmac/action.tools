import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { Node, Parent } from "unist";

export type NodeWithData = Node & { _data: { [prop: string]: any } };

export const markdownToMdast = (text: string): Parent => {
  return unified()
    .use(markdown, { gfm: true })
    .parse(text) as Parent;
};

export const mdastToMarkdown = async (tree: Parent): Promise<string> => {
  return unified()
    .use(stringify, {
      listItemIndent: "1"
    })
    .stringify(tree);
};
