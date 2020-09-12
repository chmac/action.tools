import { Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { finishTask, taskWithContext } from "do.md";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { reverse } from "remeda";
import { removeId } from "../../services/now/now.state";
import { AppDispatch, AppState } from "../../store";
import Actions from "./components/Actions.component";
import Data from "./components/Data.component";

export enum TaskSingleActionSet {
  review,
  do,
}

const Parents = ({
  parents,
}: {
  parents: ReturnType<typeof taskWithContext>["tasks"];
}) => {
  if (parents.length === 0) {
    return null;
  }

  return (
    <div>
      <ul>
        {reverse(parents).map((task) => {
          return (
            <Typography component="li" key={task.id}>
              {task.contentMarkdown}
            </Typography>
          );
        })}
      </ul>
    </div>
  );
};

const TaskSingle = ({
  taskId,
  actionSet,
}: {
  taskId: string;
  actionSet: TaskSingleActionSet;
}) => {
  const classes = useStyles();
  const { tasks, titles } = useSelector((state: AppState) =>
    taskWithContext(state, taskId)
  );
  const dispatch: AppDispatch = useDispatch();
  const [task, ...parents] = tasks;

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
          <Parents parents={parents} />
          <Typography className={classes.task}>
            {task.contentMarkdown}
          </Typography>
          {task.hasUnfinishedChildren ? (
            <Typography>Warning: This task has unfinished children</Typography>
          ) : null}
          <Data task={task} />
        </Paper>
        {actionSet === TaskSingleActionSet.do ? (
          <div className={classes.buttonWrapper}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.done}
              onClick={() => {
                dispatch(finishTask(taskId));
                dispatch(removeId(taskId));
              }}
            >
              Done
            </Button>
          </div>
        ) : null}
      </div>
      {actionSet === TaskSingleActionSet.review ? (
        <Actions taskId={taskId} />
      ) : null}
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
