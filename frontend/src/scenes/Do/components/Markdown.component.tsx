import React, { useCallback } from "react";
import unified from "unified";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import { filterTasks, today } from "do.md";
import listItemDefault from "mdast-util-to-hast/lib/handlers/list-item";
import { isTask } from "do.md/dist/utils";

import { markdownToMdast } from "../../../services/mdast/mdast.service";
import { Node, Parent, Position } from "unist";

type H = (node: any, tagName: string, props: {}, children: Node[]) => Node;

// const listItem = (h: H, node: Node, parent: Parent) => {
//   if (isTask(node)) {
//     const { children, position } = node;
//     // Transform the children here
//     const newChildren = children.reduce(child => {}, []);

//     return h(
//       node,
//       "li",
//       {
//         position
//       },
//       node.children
//     );
//     debugger;
//   }
//   return listItemDefault(h, node, parent);
// };

const toReactProcessor = unified().use(remark2rehype, {
  handlers: {
    // We add position data to any `listItem` node which is a task. This allows
    // us to handle clicks on the node and figure out where it was positioned in
    // the original markdown document.
    listItem: (h: any, node: Node, parent: Parent) => {
      const hast = listItemDefault(h, node, parent);
      if (!isTask(node)) {
        return hast;
      }
      const { position, checked } = node;
      const { properties, ...rest } = hast;
      return { ...rest, properties: { ...properties, position, checked } };
    }
  }
});

type SetCheckedByLineNumber = (
  lineNumber: number,
  currentCheckedValue: boolean
) => void;

const LiFactory = (setCheckedByLineNumber: SetCheckedByLineNumber) => {
  const Li = (props: {
    position: Position;
    children: Element[];
    checked: boolean;
  }) => {
    const { position, checked, ...rest } = props;

    return (
      <li
        {...rest}
        onClick={event => {
          // Descendant (child / grandchild / etc) tasks are nested inside other
          // tasks, so we need to stop the event propagating up the tree.
          event.stopPropagation();
          setCheckedByLineNumber(position.start.line, checked);
        }}
      />
    );
  };
  return Li;
};

type Props = {
  markdown: string;
  showCompleted: boolean;
  ignoreDates: boolean;
  filterText: string;
  setCheckedByLineNumber: SetCheckedByLineNumber;
};

const Markdown = (props: Props) => {
  const {
    markdown,
    showCompleted,
    ignoreDates,
    filterText,
    setCheckedByLineNumber
  } = props;

  const getReact = useCallback(() => {
    const mdast = markdownToMdast(markdown);
    // debugger;
    const filtered = filterTasks(
      mdast,
      filterText,
      ignoreDates ? undefined : today(),
      showCompleted
    );
    // return rehype2reactProcess.stringify(toReactProcessor.runSync(filtered));
    const hast = toReactProcessor.runSync(filtered);

    const elements = unified()
      .use(rehype2react, {
        createElement: React.createElement,
        components: {
          li: LiFactory(setCheckedByLineNumber)
        }
      })
      .stringify(hast);

    return elements;
    // const out = toReactProcessor.runSync(filtered);
    // debugger;
    // return out;
    // const (result  = toReactProcessor.runSync(filtered);
    // const { contents } = result;
    // return contents;
  }, [markdown, showCompleted, ignoreDates, filterText]);

  const reactTree = getReact();

  // debugger;

  return <div>{reactTree}</div>;
};

export default Markdown;
