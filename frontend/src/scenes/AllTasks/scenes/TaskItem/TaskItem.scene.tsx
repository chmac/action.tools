import {
  Checkbox,
  createStyles,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { orange, red } from "@material-ui/core/colors";
import { createSelector } from "@reduxjs/toolkit";
import classNames from "classnames";
import {
  constants,
  dateToHuman,
  finishTask,
  getPackageState as getDomdState,
  Task,
  TaskData,
  unfinishTask,
} from "do.md";
import Markdown from "markdown-to-jsx";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import EditButton from "../../../EditButton/EditButton.scene";

const makeChildTasksSelector = () =>
  createSelector(
    [
      (_state: AppState, parentId: string) => parentId,
      (state: AppState) => state.__domd.data.tasks,
    ],
    (parentId, tasks) => tasks.filter((task) => task.parentId === parentId)
  );

const Data = ({ data }: { data: TaskData }) => {
  const classes = useStyles();
  const today = useSelector(
    (state: AppState) => getDomdState(state).query.today
  );

  const dataEntries = Object.entries(data);
  const hasData = dataEntries.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <>
      <br />
      <span style={{ paddingLeft: 42 }} />
      {dataEntries.map(([key, value]) => {
        if (key === "contexts") {
          return (
            <span
              key={key}
              className={classes.light}
            >{`@${(value as string[]).join(" @")}`}</span>
          );
        }

        if (key === constants.BY || key === constants.AFTER) {
          const { todayText, isOverdue, isThisWeek, isToday } = dateToHuman({
            date: value as string,
            today,
            dateType: key,
          });
          return (
            <span key={key}>
              <strong>{key === constants.BY ? "BY" : constants.AFTER}</strong>:{" "}
              {value} (
              <span
                className={classNames({
                  [classes.thisWeek]: isThisWeek,
                  [classes.today]: isToday,
                  [classes.overdue]: isOverdue,
                })}
              >
                {todayText}
              </span>
              ){" "}
            </span>
          );
        }

        return (
          <span key={key} className={classes.light}>
            {key}: {value}{" "}
          </span>
        );
      })}
    </>
  );
};

const TaskItem = ({ task, depth = 0 }: { task: Task; depth?: number }) => {
  const selectChildTasks = useMemo(makeChildTasksSelector, []);
  const tasks = useSelector((state: AppState) =>
    selectChildTasks(state, task.id)
  );
  const dispatch = useDispatch<AppDispatch>();

  // Show this task wrapped in an outline if it is either not a task, or it is a
  // sequential task
  const hideOutline = !task.isTask || task.isSequential;

  return (
    <Paper
      variant={hideOutline ? "elevation" : "outlined"}
      elevation={hideOutline ? 0 : undefined}
      square
      style={{
        paddingLeft: depth * 42 + (task.isTask ? 0 : 42),
      }}
    >
      <Typography>
        {task.isTask ? (
          <Checkbox
            checked={task.finished}
            color="default"
            onChange={(event) => {
              if (event.target.checked) {
                dispatch(finishTask(task.id));
              } else {
                dispatch(unfinishTask(task.id));
              }
            }}
          />
        ) : null}
        <Markdown options={{ forceInline: true }}>
          {task.contentMarkdown}
        </Markdown>
        <Data data={task.data} />{" "}
        {task.isTask ? <EditButton taskId={task.id} /> : null}
      </Typography>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} depth={depth + 1} />
      ))}
    </Paper>
  );
};

export default TaskItem;

const useStyles = makeStyles((theme) => {
  return createStyles({
    today: {
      backgroundColor: orange[500],
    },
    thisWeek: {
      backgroundColor: orange[100],
    },
    light: { opacity: 0.6 },
    overdue: {
      color: red[900],
      fontWeight: 700,
      fontSize: "1.5em",
    },
  });
});
