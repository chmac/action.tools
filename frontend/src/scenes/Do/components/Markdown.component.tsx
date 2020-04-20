import React, { useCallback } from "react";
import unified from "unified";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";
import { filterTasks, today, countTasks } from "do.md";
import { Node, Parent } from "unist";
import u from "unist-builder";
import reduce from "unist-util-reduce";
import unistFilter from "unist-util-filter";
import listItemDefault from "mdast-util-to-hast/lib/handlers/list-item";
import listDefault from "mdast-util-to-hast/lib/handlers/list";
import { Typography, Paper, makeStyles } from "@material-ui/core";
import { isTask } from "do.md/dist/utils";
import { Filter } from "do.md/dist/filter";

import { markdownToMdast } from "../../../services/mdast/mdast.service";
import TaskFactory, { SetCheckedByLineNumber } from "./Task.component";
import DataFactory from "./Data.component";

const toRehypeProcessor = unified().use(remark2rehype, {
  handlers: {
    list: (h: any, node: Node, parent: Parent) => {
      const hast = listDefault(h, node, parent);
      const { properties, ...rest } = hast;
      return {
        ...rest,
        // Add a `isRootList: boolean` prop, `"true"` if this is a root level
        // list, and `"false"` if this is a nested list.
        // NOTE: The value here is a string, not a boolean, to keep React happy
        properties: {
          ...properties,
          isRootList: parent.type === "root" ? "true" : "false",
        },
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
    },
  },
});

const doesListContainTasks = (node: Parent): boolean => {
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

const removeHeadingsWithoutTasks = (input: Parent): Parent => {
  // Remove empty `list` nodes
  const filteredWithoutChildren = reduce(input, (node, path, root) => {
    if (node.type === "list" && (node as Parent).children.length === 0) {
      return [];
    }
    return node;
  });

  // Trim off any headings which don't contain tasks
  // const filteredWithoutHeadings = visit
  const filteredWithoutHeadingsMaybe = unistFilter<Parent>(
    filteredWithoutChildren,
    (
      node,
      index: number | undefined,
      parent: Parent | undefined
    ): node is Parent => {
      // NOTE: `parent.children[index] === node`
      if (typeof index === "undefined" || typeof parent === "undefined") {
        throw new Error("Unknown heading filtering error #oAFAm8");
      }

      // We only filter for root level paragraph tags, all others are
      // allowed to stay.
      if (parent === null || parent.type !== "root") {
        return true;
      }

      const { type } = node as Node;

      if (type === "list") {
        if (doesListContainTasks(node as Parent)) {
          return true;
        }
      }

      if (type === "paragraph" || type === "list") {
        const followingSiblings = parent.children.slice(index + 1);
        const foundSibling = followingSiblings.find((sibling) => {
          // If this is a heading AND matches the same depth
          if (
            sibling.type === "list" &&
            doesListContainTasks(sibling as Parent)
          ) {
            return true;
          }
          return false;
        });

        if (typeof foundSibling === "undefined") {
          return false;
        }

        if (foundSibling.type === "list") {
          return true;
        }

        return true;
      }

      if (type === "heading") {
        const { depth } = node as { depth: number };
        // We want to test, if this is an `h1`, are there any `list` elements
        // between our position and the next `h1`, or the end of the array
        const followingSiblings = parent.children.slice(index + 1);
        const foundSibling = followingSiblings.find((sibling) => {
          // If this is a heading AND it is of equal or lower depth. As in, if
          // we're currently scanning from an `h1`, then we ignore `h2` (2 <=
          // 1), but we stop on an `h1`. If we're scanning from an `h2` then we
          // stop on an `h1` (1 <= 2).
          if (
            sibling.type === "heading" &&
            ((sibling as unknown) as { depth: number }).depth <= depth
          ) {
            return true;
          }

          if (
            sibling.type === "list" &&
            doesListContainTasks(sibling as Parent)
          ) {
            return true;
          }

          return false;
        });

        // If we found no matching nodes, then we did not find a list, so this
        // heading can be removed
        if (typeof foundSibling === "undefined") {
          return false;
        }

        // If we found a matching heading, then this node is unnecessary
        if (foundSibling.type === "heading") {
          return false;
        }

        if (foundSibling.type === "list") {
          return true;
        }

        return true;
      }

      return true;
    }
  );

  return filteredWithoutHeadingsMaybe || u("root", []);
};

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

    const areFiltersEmpty = filtered === mdast;

    const pruned = areFiltersEmpty
      ? mdast
      : removeHeadingsWithoutTasks(filtered);

    const count = countTasks(pruned);

    // Now we convert the mdast into an hast
    const hast = toRehypeProcessor.runSync(pruned);

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
            const { isRootList, ...otherProps } = props;

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
            if (props.isRootList === "true") {
              return (
                <Paper className={classes.paper}>
                  <ul {...otherProps} />
                </Paper>
              );
            }

            return <ul {...otherProps} />;
          },
          ol: (props: any) => {
            const { isRootList, ...otherProps } = props;

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
            if (props.isRootList === "true") {
              return (
                <Paper className={classes.paper}>
                  <ol {...otherProps} />
                </Paper>
              );
            }

            return <ol {...otherProps} />;
          },
          li: TaskFactory(setCheckedByLineNumber),
        },
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

const useStyles = makeStyles((theme) => ({
  page: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  paper: {
    padding: theme.spacing(2),
  },
  markdown: {
    minHeight: "100vh",
  },
  bottomActions: {
    marginTop: 100,
    padding: theme.spacing(2),
  },
}));
