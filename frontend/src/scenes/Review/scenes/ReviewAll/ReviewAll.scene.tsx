import {
  createStyles,
  makeStyles,
  Paper,
  Switch,
  Typography,
} from "@material-ui/core";
import { getPackageState, selectActionableTodayFactory, Task } from "do.md";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { groupBy, mapToObj } from "remeda";
import { AppState } from "../../../../store";
import TaskItem, {
  TaskItemActionSet,
} from "../../../AllTasks/scenes/TaskItem/TaskItem.scene";

enum TaskGroups {
  today = "today",
  overdue = "overdue",
  undated = "undated",
}

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

  const today = useSelector(
    (state: AppState) => getPackageState(state).query.today
  );
  const tasks = useSelector(actionableTodaySelector);
  const nowIds = useSelector((state: AppState) => state.now.taskIds);

  // This is a list of tasksk which have not yet been added to the "now" list
  const remainingTasksList = useMemo(
    () => tasks.filter((task) => !nowIds.includes(task.id)),
    [tasks, nowIds]
  );

  // Group the tasks by date
  const taskGroups = useMemo(() => {
    const base = mapToObj(Object.values(TaskGroups), (val): [
      TaskGroups,
      Task[]
    ] => [val, []]);

    const groups = groupBy(remainingTasksList, (task) => {
      if (typeof task.data.by === "string" && task.data.by === today) {
        return TaskGroups.today;
      }
      if (typeof task.data.snooze === "string") {
        if (task.data.snooze === today) {
          return TaskGroups.today;
        }
        // If the task has a `snooze` date, and that date is not today, we can
        // shortcut to say that this task is overdue because the `snooze` date
        // is always later than the `after` date, and must always be today or in
        // the past, otherwise the task is omitted from this list.
        return TaskGroups.overdue;
      }
      if (typeof task.data.after === "string" && task.data.after === today) {
        return TaskGroups.today;
      }
      return TaskGroups.undated;
    });

    return { ...base, ...groups };
  }, [today, remainingTasksList]);

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
      <Typography variant="h3">Today</Typography>
      <Paper elevation={1} className={classes.paper}>
        {taskGroups[TaskGroups.today].map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            actionSet={TaskItemActionSet.review}
          />
        ))}
      </Paper>
      <Typography variant="h3">Overdue</Typography>
      <Paper elevation={1} className={classes.paper}>
        {taskGroups[TaskGroups.overdue].map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            actionSet={TaskItemActionSet.review}
          />
        ))}
      </Paper>
      <Typography variant="h3">Undated</Typography>
      <Paper elevation={1} className={classes.paper}>
        {taskGroups[TaskGroups.undated].map((task) => (
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
