import { makeStyles, Paper, Typography } from "@material-ui/core";
import { REDUX_ROOT_KEY } from "do.md";
import React, { createElement } from "react";
import { useSelector } from "react-redux";
import rehype2react from "rehype-react";
import remark2rehype from "remark-rehype";
import unified from "unified";
import remark2react from "remark-react";
import { Node } from "unist";
import { AppState } from "../../store";

const converterOld = unified()
  .use(remark2rehype)
  .use(rehype2react, { createElement });
const processor = unified().use(remark2react, { createElement });

const mdastToReact = <T extends Node>(content?: T | T[]) => {
  if (typeof content === "undefined") {
    return null;
  }

  const children = Array.isArray(content) ? content : [content];

  if (children.length === 0) {
    return null;
  }

  return processor.stringify({
    type: "root",
    children,
  });
};

const AllTasks = () => {
  const classes = useStyles();
  const { sections, tasks } = useSelector((state: AppState) => {
    return {
      sections: state[REDUX_ROOT_KEY].data.sections,
      tasks: state[REDUX_ROOT_KEY].data.tasks,
    };
  });

  return (
    <div className={classes.page}>
      <Typography variant="h1">Tasks</Typography>
      {sections.map((section) => {
        return (
          <div key={section.id}>
            {mdastToReact(section.heading)}
            {mdastToReact(section.contents)}
            <Paper elevation={1} className={classes.paper}>
              {tasks
                .filter((task) => task.sectionId === section.id)
                .map((task) => {
                  return (
                    <div key={task.id}>
                      {mdastToReact({
                        type: "list",
                        ordered: false,
                        children: task.contents,
                      })}
                    </div>
                  );
                })}
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

export default AllTasks;

const useStyles = makeStyles((theme) => ({
  page: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  paper: {
    padding: theme.spacing(2),
  },
  date: {
    width: 100,
  },
  markdown: {
    minHeight: "100vh",
  },
  bottomActions: {
    marginTop: 100,
    padding: theme.spacing(2),
  },
}));
