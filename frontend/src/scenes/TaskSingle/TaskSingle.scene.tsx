import { makeStyles, Paper, Typography, Button } from "@material-ui/core";
import { sectionTitles, taskById } from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import Actions from "./components/Actions.component";
import Data from "./components/Data.component";

export enum ActionSet {
  review,
  do,
}

const TaskSingle = ({
  taskId,
  actionSet,
}: {
  taskId: string;
  actionSet: ActionSet;
}) => {
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
        {actionSet === ActionSet.do ? (
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.done}
            >
              Done
            </Button>
          </div>
        ) : null}
      </div>
      {actionSet === ActionSet.review ? <Actions taskId={taskId} /> : null}
    </>
  );
};

export default TaskSingle;

const useStyles = makeStyles((theme) => {
  return {
    taskWrapper: {
      [theme.breakpoints.up("sm")]: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: -1,
      },
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    buttonWrapper: {
      padding: theme.spacing(4),
    },
    done: {
      fontSize: "4rem",
      padding: theme.spacing(2),
    },
    paper: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        minHeight: 400,
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
