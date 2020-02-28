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

const toRehypeProcessor = unified().use(remark2rehype, {
  handlers: {
    listItem: (h: any, node: Node, parent: Parent) => {
      const hast = listItemDefault(h, node, parent);
      if (!isTask(node)) {
        return hast;
      }
      // We add data to any `listItem` node which is a task. This data is
      // helpful later when we want to work with the task.
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
          // tasks, so we need to stop the event propagating up the tree,
          // otherwise we end up with a click event on each of the ancestors of
          // the task which was clicked.
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
    // First convert the text markdown into an mdast
    const mdast = markdownToMdast(markdown);

    // Then apply our filter settings
    const filtered = filterTasks(
      mdast,
      filterText,
      ignoreDates ? undefined : today(),
      showCompleted
    );

    // Now we convert the mdast into an hast
    const hast = toRehypeProcessor.runSync(filtered);

    // We convert the hast into `createElement()` calls
    const elements = unified()
      .use(rehype2react, {
        createElement: React.createElement,
        components: {
          li: LiFactory(setCheckedByLineNumber)
        }
      })
      .stringify(hast);

    return elements;
  }, [
    markdown,
    showCompleted,
    ignoreDates,
    filterText,
    setCheckedByLineNumber
  ]);

  return <div>{getReact()}</div>;
};

export default Markdown;
