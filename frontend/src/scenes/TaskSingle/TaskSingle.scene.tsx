import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { finishTask, sectionTitles, snoozeTask, taskById } from "do.md";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addId } from "../../services/now/now.state";
import { AppDispatch, AppState } from "../../store";
import Data from "./components/Data.component";

const TaskSingle = ({ taskId }: { taskId: string }) => {
  const classes = useStyles();
  const task = useSelector((state: AppState) => taskById(state, taskId));
  const titles = useSelector((state: AppState) =>
    sectionTitles(state, task.sectionId)
  );
  const dispatch: AppDispatch = useDispatch();

  if (typeof task === "undefined") {
    return <div>Error #Lb1rHu</div>;
  }

  return (
    <>
      <div className={classes.taskWrapper}>
        <Paper elevation={1} className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            {titles.join(" ") || "Inbox"}
          </Typography>
          <Typography className={classes.task}>
            {task.contentMarkdown}
          </Typography>
          {task.hasUnfinishedChildren ? (
            <Typography>Warning: This task has unfinished children</Typography>
          ) : null}
          <Data data={task.data} />
        </Paper>
      </div>
      <Paper className={classes.actionWrapper}>
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            dispatch(finishTask(taskId));
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
            if (daysFromToday > 0) {
              dispatch(snoozeTask({ id: taskId, daysFromToday }));
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
    taskWrapper: {
      position: "absolute",
      top: 0,
      left: 0,
      paddingTop: 80,
      paddingBottom: 80,
      width: "100vw",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: -1,
    },
    paper: {
      minHeight: 600,
      margin: theme.spacing(2),
      padding: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        minHeight: 400,
      },
      [theme.breakpoints.up("sm")]: {
        width: 480,
        padding: theme.spacing(4),
      },
    },
    title: {
      borderBottom: "1px solid black",
      marginBottom: theme.spacing(1),
    },
    task: {
      fontSize: "2em",
    },
    actionWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      textAlign: "center",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      backgroundColor: pink[50],
    },
    actions: {
      width: 120,
      marginLeft: theme.spacing(2),
      marginRigh: theme.spacing(2),
    },
  };
});
