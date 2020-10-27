import {
  Button,
  Checkbox,
  createStyles,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { green, grey, orange, red, yellow } from "@material-ui/core/colors";
import { createSelector } from "@reduxjs/toolkit";
import classNames from "classnames";
import {
  constants,
  dateToHuman,
  finishTask,
  getPackageState as getDomdState,
  snoozeTask,
  Task,
  unfinishTask,
} from "do.md";
import Markdown from "markdown-to-jsx";
import React, { Fragment, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addId } from "../../../../services/now/now.state";
import { AppDispatch, AppState } from "../../../../store";
import EditButton from "../../../EditButton/EditButton.scene";

export enum TaskItemActionSet {
  all,
  review,
}

const makeChildTasksSelector = () =>
  createSelector(
    [
      (_state: AppState, parentId: string) => parentId,
      (state: AppState) => state.__domd.data.tasks,
    ],
    (parentId, tasks) => tasks.filter((task) => task.parentId === parentId)
  );

const Data = ({ task: { data, finished } }: { task: Task }) => {
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
            <Fragment key={key}>
              <span className={classes.light}>{`@${(value as string[]).join(
                " @"
              )}`}</span>{" "}
            </Fragment>
          );
        }

        if (!finished && (key === constants.BY || key === constants.AFTER)) {
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

const TaskItem = ({
  task,
  depth = 0,
  actionSet = TaskItemActionSet.all,
}: {
  task: Task;
  depth?: number;
  actionSet?: TaskItemActionSet;
}) => {
  const classes = useStyles();

  const selectChildTasks = useMemo(makeChildTasksSelector, []);
  const tasks = useSelector((state: AppState) =>
    selectChildTasks(state, task.id)
  );
  const dispatch = useDispatch<AppDispatch>();

  // Show this task wrapped in an outline if it is either not a task, or it is a
  // sequential task
  const hideOutline = !task.isTask || task.isSequential;

  const words = task.contentMarkdown.split(" ");
  const prios = {
    p1: words.indexOf("p1") !== -1,
    p2: words.indexOf("p2") !== -1,
    p3: words.indexOf("p3") !== -1,
    p4: words.indexOf("p4") !== -1,
  };

  return (
    <Paper
      variant={hideOutline ? "elevation" : "outlined"}
      elevation={hideOutline ? 0 : undefined}
      square
      style={{
        paddingLeft: depth * 42 + (task.isTask ? 0 : 42),
        paddingBottom: 9,
      }}
      className={classNames({
        [classes.p1]: prios.p1,
        [classes.p2]: prios.p2,
        [classes.p3]: prios.p3,
        [classes.p4]: prios.p4,
      })}
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
        <Data task={task} />{" "}
        {task.isTask && actionSet === TaskItemActionSet.review ? (
          <>
            <br />
            <span style={{ paddingLeft: 42 }} />
          </>
        ) : null}
        {task.isTask ? <EditButton taskId={task.id} /> : null}
        {task.isTask ? (
          <Button
            className={classes.actionSpacing}
            variant="outlined"
            size="small"
            onClick={() => {
              const daysFromToday = parseInt(
                prompt("How many days hence?") || "0"
              );
              if (daysFromToday > 0) {
                dispatch(snoozeTask({ id: task.id, daysFromToday }));
              }
            }}
          >
            snooze
          </Button>
        ) : null}
        {task.isTask && actionSet === TaskItemActionSet.review ? (
          <Button
            className={classes.actionSpacing}
            variant="outlined"
            size="small"
            onClick={() => {
              dispatch(addId(task.id));
            }}
          >
            now
          </Button>
        ) : null}
      </Typography>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          depth={depth + 1}
          actionSet={actionSet}
        />
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
    p1: {
      backgroundColor: red[500],
    },
    p2: {
      backgroundColor: yellow[500],
    },
    p3: {
      backgroundColor: green[300],
    },
    p4: {
      backgroundColor: grey[300],
    },
    light: { opacity: 0.6 },
    overdue: {
      color: red[900],
      fontWeight: 700,
      fontSize: "1.5em",
    },
    actionSpacing: {
      marginLeft: theme.spacing(4),
    },
  });
});
