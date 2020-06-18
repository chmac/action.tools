import { Button, Paper, Typography, makeStyles } from "@material-ui/core";
import { taskById } from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

const TaskSingle = ({
  taskId,
  onDecisionMade,
}: {
  taskId: string;
  onDecisionMade: () => void;
}) => {
  const classes = useStyles();
  const task = useSelector((state: AppState) => taskById(state, taskId));

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
          onClick={() => onDecisionMade()}
        >
          Never
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => onDecisionMade()}
        >
          Now
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => onDecisionMade()}
        >
          Tomorrow
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => onDecisionMade()}
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
