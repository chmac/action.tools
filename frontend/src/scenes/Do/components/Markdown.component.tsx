import React, { useCallback } from "react";
import unified from "unified";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import { filterTasks, today, countTasks } from "do.md";
import { Node, Parent } from "unist";
import listItemDefault from "mdast-util-to-hast/lib/handlers/list-item";
import listDefault from "mdast-util-to-hast/lib/handlers/list";
import { Typography, Paper, makeStyles } from "@material-ui/core";
import { isTask } from "do.md/dist/utils";

import { markdownToMdast } from "../../../services/mdast/mdast.service";
import TaskFactory, { SetCheckedByLineNumber } from "./Task.component";
import DataFactory from "./Data.component";
import { Filter } from "do.md/dist/filter";

const toRehypeProcessor = unified().use(remark2rehype, {
  handlers: {
    list: (h: any, node: Node, parent: Parent) => {
      const hast = listDefault(h, node, parent);
      const { properties, ...rest } = hast;
      return {
        ...rest,
        // Add a `rootLevel: boolean` prop, `true` if this is a root level list,
        // and false if this is a nested list.
        properties: { ...properties, isRootList: parent.type === "root" }
      };
    },
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
  const classes = useStyles(props);
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
          h1: (props: any) => <Typography variant="h1" {...props} />,
          h2: (props: any) => <Typography variant="h2" {...props} />,
          h3: (props: any) => <Typography variant="h3" {...props} />,
          h4: (props: any) => <Typography variant="h4" {...props} />,
          code: DataFactory(today()),
          ul: (props: any) => {
            // If this list does not contain any items, then do not render it at
            // all. Empty lists contain a single element which is a newline
            // character.
            if (props.children[0] === "\n" && props.children.length === 1) {
              return null;
            }

            // If this list contains the `rootLevel` prop, which we set above,
            // then render it wrapped in a `<Paper` element. We do not want to
            // nest `<Paper` elements which is why we apply this only to the
            // root level lists.
            if (props.isRootList) {
              return (
                <Paper className={classes.paper}>
                  <ul {...props} />
                </Paper>
              );
            }

            return <ul {...props} />;
          },
          li: TaskFactory(setCheckedByLineNumber)
        }
      })
      .stringify(hast);

    return { count, elements };
  }, [markdown, filter, setCheckedByLineNumber, classes]);

  const { count, elements } = getReact();

  return (
    <>
      <Typography>Count: {count}</Typography>
      <div>{elements}</div>
    </>
  );
};

export default Markdown;

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: 20,
    paddingBottom: 100
  },
  paper: {
    padding: theme.spacing(2)
  },
  markdown: {
    minHeight: "100vh"
  },
  bottomActions: {
    marginTop: 100,
    padding: theme.spacing(2)
  }
}));
