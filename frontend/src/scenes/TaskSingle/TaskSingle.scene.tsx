import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { finishTask, snoozeTask, taskById } from "do.md";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addId } from "../../services/now/now.state";
import { AppDispatch, AppState } from "../../store";

const TaskSingle = ({
  taskId,
  onDecisionMade,
}: {
  taskId: string;
  onDecisionMade: () => void;
}) => {
  const classes = useStyles();
  const task = useSelector((state: AppState) => taskById(state, taskId));
  const dispatch: AppDispatch = useDispatch();

  if (typeof task === "undefined") {
    return <div>Error #Lb1rHu</div>;
  }

  return (
    <>
      <Paper elevation={1}>
        <Typography variant="h1">{task.contentMarkdown}</Typography>
        {task.hasUnfinishedChildren ? (
          <Typography>Warning: This task has unfinished children</Typography>
        ) : null}
        <ul>
          {Object.entries(task.data).map(([key, value]) => {
            if (key === "contexts") {
              return (
                <li key="key">
                  <Typography>@{(value as string[]).join(" @")}</Typography>
                </li>
              );
            }
            return (
              <li key={key}>
                <Typography>
                  {key}: {value}
                </Typography>
              </li>
            );
          })}
        </ul>
      </Paper>
      <Paper className={classes.actionWrapper}>
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            dispatch(finishTask(taskId));
            // NOTE: Ignore this for now, as it will result in skipping one task
            // in the list
            // onDecisionMade();
          }}
        >
          Never
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            dispatch(addId(taskId));
            onDecisionMade();
          }}
        >
          Now
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            dispatch(snoozeTask({ id: taskId, daysFromToday: 1 }));
            // NOTE: Ignore this for now, as it will result in skipping one task
            // in the list
            // onDecisionMade();
          }}
        >
          Tomorrow
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            const daysFromToday = parseInt(
              prompt("How many days hence?") || "0"
            );
            if (daysFromToday !== 0) {
              dispatch(snoozeTask({ id: taskId, daysFromToday }));
              // NOTE: Ignore this for now, as it will result in skipping one
              // task in the list
              // onDecisionMade();
            }
          }}
        >
          Later
        </Button>
      </Paper>
    </>
  );
};

export default TaskSingle;

const useStyles = makeStyles((theme) => {
  return {
    actionWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      textAlign: "center",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    actions: {
      width: 120,
      marginLeft: theme.spacing(2),
      marginRigh: theme.spacing(2),
    },
  };
});
