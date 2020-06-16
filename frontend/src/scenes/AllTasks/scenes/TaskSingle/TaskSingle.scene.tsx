import { Switch, Typography } from "@material-ui/core";
import { createSelector } from "@reduxjs/toolkit";
import { Task } from "do.md/dist/types";
import toString from "mdast-util-to-string";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";

const makeChildTasksSelector = () =>
  createSelector(
    [
      (state: AppState, parentId: string) => parentId,
      (state: AppState) => state.__domd.data.tasks,
    ],
    (parentId, tasks) => tasks.filter((task) => task.parentId === parentId)
  );

const TaskSingle = ({ task, depth = 0 }: { task: Task; depth?: number }) => {
  const selectChildTasks = useMemo(makeChildTasksSelector, []);
  const tasks = useSelector((state: AppState) =>
    selectChildTasks(state, task.id)
  );

  return (
    <div>
      <Typography>
        {"- - ".repeat(depth)} <Switch checked={task.finished} />{" "}
        {toString(task.contents)}
      </Typography>
      {tasks.map((task) => (
        <TaskSingle key={task.id} task={task} depth={depth + 1} />
      ))}
    </div>
  );
};

export default TaskSingle;
