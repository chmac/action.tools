import * as R from "remeda";
import { Node, Parent } from "unist";
import { List, Heading, Paragraph, BlockContent } from "mdast";

export const isList = (node: Node): node is List => {
  return node.type === "list";
};

export const isHeading = (node: Node): node is Heading => {
  return node.type === "heading";
};

export const isParagraph = (node: Node): node is Paragraph => {
  return node.type === "paragraph";
};

export const isBlockContent = (node: Node): node is BlockContent => {
  return (
    [
      "paragraph",
      "heading",
      "thematicBreak",
      "blockquote",
      "list",
      "table",
      "html",
      "code",
    ].indexOf(node.type) !== -1
  );
};

export const doesListContainTasks = (node: List): boolean => {
  const foundTask = node.children.find((node) => {
    if (node.type === "listItem" && typeof node.checked === "boolean") {
      return true;
    }
    return false;
  });

  if (typeof foundTask === "undefined") {
    return false;
  }
  return true;
};

/**
 * Take a mdast tree and remove any redundant text.
 *
 * @param root The tree to trim
 */
export const trim = (root: Parent): Parent => {
  const nonEmptyChildren = root.children.filter((child) => {
    const { children } = child as Parent;
    return children.length > 0;
  });

  const includeChildren = nonEmptyChildren.map((node) => {
    return { include: false, node };
  });

  includeChildren.forEach((includeChild, index) => {
    const { node } = includeChild;

    if (isList(node) && doesListContainTasks(node)) {
      let currentHeadingDepth: number;
      let stopped = false;
      let foundHeading = false;

      includeChild.include = true;

      // Find the ancestors of this list which can be included
      R.times(index, (time) => {
        if (stopped) {
          return;
        }

        // We need to minus 1 because `time` will be 0 on the first iteration
        const thisRowIndex = index - time - 1;

        const row = includeChildren[thisRowIndex];

        if (isHeading(row.node)) {
          foundHeading = true;

          const { depth } = row.node;

          // If this is the first heading we found, then this is our "current
          // heading depth", because any headings above this depth are
          // considered "ancestors" of this list.
          if (typeof currentHeadingDepth === "undefined") {
            currentHeadingDepth = depth;
            row.include = true;
            // If this heading is a higher level (lower depth) than our first
            // heading, then its an "ancestor" and so we include it
          } else if (depth < currentHeadingDepth) {
            row.include = true;

            // We have now climbed one heading level, so we update
            // currentHeadingDepth to make sure that we only find 1 heading at
            // this level, and from now on, only look for higher level headings
            currentHeadingDepth = depth;

            // This heading might have direct children which also need to be
            // "kept". We include headings lower (higher number) than this one
            let nestedStopped = false;
            const timesToGoForwards = index - thisRowIndex;
            R.times(timesToGoForwards, (time) => {
              if (nestedStopped) {
                return;
              }
              const nextChild = includeChildren[thisRowIndex + time + 1];
              if (isHeading(nextChild.node)) {
                nestedStopped = true;
                return;
              } else if (isBlockContent(nextChild.node)) {
                nextChild.include = true;
              }
            });
          }

          // If we reach an h1, then we stop navigating further up the tree,
          // this is the "top" of our "section"
          if (depth === 1) {
            stopped = true;
            return;
          }
        }

        // Any paragraphs or lists directly above this list, without a heading
        // in between, are included
        if (!foundHeading && isBlockContent(row.node)) {
          row.include = true;
        }
      });
    }
  });

  const output = includeChildren
    .filter(({ include }) => include)
    .map(({ node }) => node);

  return {
    ...root,
    children: output,
  };
};
