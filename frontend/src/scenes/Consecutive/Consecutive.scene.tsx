import { makeStyles, Paper, Typography } from "@material-ui/core";
import { isReady, makeActionableTodaySelector } from "do.md";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TaskSingle from "../TaskSingle/TaskSingle.scene";

const Consecutive = () => {
  const classes = useStyles();

  const dataLoaded = useSelector(isReady);
  const actionableTodaySelector = useMemo(
    () => makeActionableTodaySelector(),
    []
  );
  const tasks = useSelector(actionableTodaySelector);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // NOTE: This should never render as the route is only rendered AFTER data has
  // loaded
  if (!dataLoaded) {
    return <div>Loading...</div>;
  }

  if (tasks.length === 0) {
    return (
      <Paper elevation={1} className={classes.paper}>
        <Typography variant="h1">Zero</Typography>
        <Typography>Nothing to review. Congrats.</Typography>
      </Paper>
    );
  }

  if (currentTaskIndex >= tasks.length) {
    return (
      <Paper elevation={1} className={classes.paper}>
        <Typography variant="h1">Finished</Typography>
        <Typography>Review completed. Congrats.</Typography>
      </Paper>
    );
  }

  const taskId = tasks[currentTaskIndex].id;

  return (
    <TaskSingle
      taskId={taskId}
      onDecisionMade={() => {
        setCurrentTaskIndex(currentTaskIndex + 1);
      }}
    />
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
