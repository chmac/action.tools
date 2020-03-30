import React, { useCallback } from "react";
import unified from "unified";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import { filterTasks, today, countTasks } from "do.md";
import { Node, Parent } from "unist";
import listItemDefault from "mdast-util-to-hast/lib/handlers/list-item";
import { isTask } from "do.md/dist/utils";

import { markdownToMdast } from "../../../services/mdast/mdast.service";
import TaskFactory, { SetCheckedByLineNumber } from "./Task.component";
import DataFactory from "./Data.component";
import { Filter } from "do.md/dist/filter";
import { Typography } from "@material-ui/core";

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

type Props = {
  markdown: string;
  filter: Filter;
  setCheckedByLineNumber: SetCheckedByLineNumber;
};

const Markdown = (props: Props) => {
  const { markdown, filter, setCheckedByLineNumber } = props;

  const getReact = useCallback(() => {
    // First convert the text markdown into an mdast
    const mdast = markdownToMdast(markdown);

    // Then apply our filter settings
    const filtered = filterTasks(mdast, filter);

    const count = countTasks(filtered);

    // Now we convert the mdast into an hast
    const hast = toRehypeProcessor.runSync(filtered);

    // We convert the hast into `createElement()` calls
    const elements = unified()
      .use(rehype2react, {
        createElement: React.createElement,
        components: {
          code: DataFactory(today()),
          li: TaskFactory(setCheckedByLineNumber)
        }
      })
      .stringify(hast);

    return { count, elements };
  }, [markdown, filter, setCheckedByLineNumber]);

  const { count, elements } = getReact();

  return (
    <>
      <Typography>Count: {count}</Typography>
      <div>{elements}</div>
    </>
  );
};

export default Markdown;
