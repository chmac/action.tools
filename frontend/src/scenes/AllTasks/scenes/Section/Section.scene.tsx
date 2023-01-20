import { makeStyles, Paper, Typography } from "@material-ui/core";
import { createSelector } from "@reduxjs/toolkit";
import { Section } from "do.md";
import { Heading } from "mdast";
import toString from "mdast-util-to-string";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import TaskItem from "../TaskItem/TaskItem.scene";

const makeSectionTasksSelector = () =>
  createSelector(
    [
      (state: AppState, sectionId: string) => sectionId,
      (state: AppState) => state.__domd.data.tasks,
    ],
    (sectionId, tasks) =>
      tasks.filter(
        (task) => task.parentId === "" && task.sectionId === sectionId
      )
  );

const SectionHeading = ({ heading }: { heading?: Heading }) => {
  if (typeof heading === "undefined") {
    return null;
  }

  const { depth } = heading;

  const text = toString(heading);
  const leading = "#".repeat(depth);
  const variant = `h${depth}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Typography variant={variant}>
      {leading} {text}
    </Typography>
  );
};

const SectionScene = ({ section }: { section: Section }) => {
  const classes = useStyles();
  const selectSectionTasks = useMemo(makeSectionTasksSelector, []);
  const tasks = useSelector((state: AppState) =>
    selectSectionTasks(state, section.id)
  );

  return (
    <div>
      <SectionHeading heading={section.heading} />
      <Typography>{toString(section.contents)}</Typography>

      <Paper elevation={1} className={classes.paper}>
        {tasks.map((task, i) => (
          <TaskItem key={i} task={task} />
        ))}
      </Paper>
    </div>
  );
};

export default SectionScene;

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: theme.spacing(2),
    },
  };
});
