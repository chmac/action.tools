import { makeStyles, Paper, Switch, Typography } from "@material-ui/core";
import { isReady, selectActionableTodayFactory } from "do.md";
import mousetrap from "mousetrap";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import TaskItem from "../AllTasks/scenes/TaskItem/TaskItem.scene";
import TaskSingle, { ActionSet } from "../TaskSingle/TaskSingle.scene";

const assertNever = (no: never): never => {
  throw new Error("assertNever #pcQASS");
};

enum KEY {
  a = "a",
}
const keys = Object.values(KEY);

const Consecutive = () => {
  const classes = useStyles();

  const [showAll, setShowAll] = useState(false);
  const dataLoaded = useSelector(isReady);
  const actionableTodaySelector = useMemo(
    () => selectActionableTodayFactory(),
    []
  );
  const tasks = useSelector(actionableTodaySelector);
  const nowIds = useSelector((state: AppState) => state.now.taskIds);

  const handler = useCallback(
    (key: KEY) => {
      switch (key) {
        case KEY.a: {
          setShowAll(!showAll);
          break;
        }
        default: {
          assertNever(key);
        }
      }
    },
    [showAll, setShowAll]
  );

  useEffect(() => {
    mousetrap.bind(keys, (event, key) => {
      handler(key as KEY);
    });
    return () => {
      mousetrap.unbind(keys);
    };
  }, [handler]);

  const remainingTasks = tasks.filter((task) => !nowIds.includes(task.id));

  // NOTE: This should never render as the route is only rendered AFTER data has
  // loaded
  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  if (remainingTasks.length === 0) {
    return (
      <>
        <Paper elevation={1} className={classes.paper}>
          <Typography variant="h1">Zero</Typography>
          <Typography>Nothing to review. Congrats.</Typography>
        </Paper>
      </>
    );
  }

  if (showAll) {
    return (
      <>
        <Typography>
          <Switch
            checked={showAll}
            onChange={() => {
              setShowAll(!showAll);
            }}
          />{" "}
          Show all?
        </Typography>
        <Paper elevation={1} className={classes.paper}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Paper>
      </>
    );

    // return tasks.map((task) => <TaskInList key={task.id} task={task} />);
  }

  const taskId = remainingTasks[0].id;

  return (
    <>
      <Typography>
        <Switch
          value={showAll}
          onChange={() => {
            setShowAll(!showAll);
          }}
        />{" "}
        Show all?
      </Typography>
      <TaskSingle taskId={taskId} actionSet={ActionSet.review} />
    </>
  );
};

export default Consecutive;

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
  };
});
