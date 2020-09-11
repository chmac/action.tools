import {
  Paper,
  Switch,
  Typography,
  makeStyles,
  createStyles,
  Grid,
} from "@material-ui/core";
import { selectActionableTodayFactory } from "do.md";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import TaskItem, {
  TaskItemActionSet,
} from "../../../AllTasks/scenes/TaskItem/TaskItem.scene";

const ReviewAll = ({
  showAll,
  setShowAll,
}: {
  showAll: boolean;
  setShowAll: (showAll: boolean) => void;
}) => {
  const classes = useStyles();

  const actionableTodaySelector = useMemo(
    () => selectActionableTodayFactory(),
    []
  );

  const tasks = useSelector(actionableTodaySelector);
  const nowIds = useSelector((state: AppState) => state.now.taskIds);

  const allTasksList = tasks.filter((task) => !nowIds.includes(task.id));

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
      {nowIds.length === 0 ? null : (
        <>
          <Typography variant="h2">Do</Typography>
          <Paper elevation={1} className={classes.paper}>
            <ul>
              {nowIds.map((id) => {
                return <li key={id}>{id}</li>;
              })}
            </ul>
          </Paper>
        </>
      )}
      <Typography variant="h2">Review</Typography>
      <Paper elevation={1} className={classes.paper}>
        {allTasksList.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            actionSet={TaskItemActionSet.review}
          />
        ))}
      </Paper>
    </>
  );
};

export default ReviewAll;

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
  })
);
