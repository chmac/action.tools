import { makeStyles, Paper, Typography } from "@material-ui/core";
import { sectionTitles, taskById } from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import Actions from "./components/Actions.component";
import Data from "./components/Data.component";

const TaskSingle = ({ taskId }: { taskId: string }) => {
  const classes = useStyles();
  const task = useSelector((state: AppState) => taskById(state, taskId));
  const titles = useSelector((state: AppState) =>
    sectionTitles(state, task.sectionId)
  );

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
      <Actions taskId={taskId} />
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
  };
});
