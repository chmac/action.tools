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
    <Paper elevation={1}>
      <Typography variant="h1">{task.contentMarkdown}</Typography>
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
      <div className={classes.actionWrapper}>
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
      </div>
    </Paper>
  );
};

export default TaskSingle;

const useStyles = makeStyles((theme) => {
  return {
    actionWrapper: {
      textAlign: "center",
      // display: "flex",
      // justifyContent: "center",
    },
    actions: {
      // flex: 1,
      width: 120,
      marginLeft: theme.spacing(2),
      marginRigh: theme.spacing(2),
    },
  };
});
