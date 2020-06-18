import { makeStyles, Paper, Typography } from "@material-ui/core";
import { isReady, makeActionableTodaySelector } from "do.md";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import TaskSingle from "../TaskSingle/TaskSingle.scene";

const Consecutive = () => {
  const classes = useStyles();

  const dataLoaded = useSelector(isReady);
  const actionableTodaySelector = useMemo(
    () => makeActionableTodaySelector(),
    []
  );
  const tasks = useSelector(actionableTodaySelector);
  const nowIds = useSelector((state: AppState) => state.now.taskIds);

  const remainingTasks = tasks.filter((task) => !nowIds.includes(task.id));

  // NOTE: This should never render as the route is only rendered AFTER data has
  // loaded
  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  if (remainingTasks.length === 0) {
    return (
      <Paper elevation={1} className={classes.paper}>
        <Typography variant="h1">Zero</Typography>
        <Typography>Nothing to review. Congrats.</Typography>
      </Paper>
    );
  }

  const taskId = remainingTasks[0].id;

  return <TaskSingle taskId={taskId} />;
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
