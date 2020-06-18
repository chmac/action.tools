import { Checkbox, Paper, Typography } from "@material-ui/core";
import { createSelector } from "@reduxjs/toolkit";
import { finishTask, unfinishTask } from "do.md";
import { Task, TaskData } from "do.md";
import Markdown from "markdown-to-jsx";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";

const makeChildTasksSelector = () =>
  createSelector(
    [
      (state: AppState, parentId: string) => parentId,
      (state: AppState) => state.__domd.data.tasks,
    ],
    (parentId, tasks) => tasks.filter((task) => task.parentId === parentId)
  );

const Data = ({ data }: { data: TaskData }) => {
  const dataEntries = Object.entries(data);
  const hasData = dataEntries.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <>
      <br />
      <span style={{ paddingLeft: 42 }} />
      {dataEntries.map(([key, value]) => {
        if (key === "contexts") {
          return <span>{`@${(value as string[]).join(" @")}`}</span>;
        }
        return (
          <span>
            {key}: {value}{" "}
          </span>
        );
      })}
    </>
  );
};

const TaskSingle = ({ task, depth = 0 }: { task: Task; depth?: number }) => {
  const selectChildTasks = useMemo(makeChildTasksSelector, []);
  const tasks = useSelector((state: AppState) =>
    selectChildTasks(state, task.id)
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Paper
      variant={task.isSequential ? "elevation" : "outlined"}
      square
      style={{
        paddingLeft: depth * 42 + (task.isTask ? 0 : 42),
      }}
    >
      <Typography>
        <Checkbox
          checked={task.finished}
          color="default"
          onChange={(event) => {
            if (event.target.checked) {
              dispatch(finishTask(task.id));
            } else {
              dispatch(unfinishTask(task.id));
            }
          }}
        />
        <Markdown options={{ forceInline: true }}>
          {task.contentMarkdown}
        </Markdown>
        <Data data={task.data} />
      </Typography>
      {tasks.map((task) => (
        <TaskSingle key={task.id} task={task} depth={depth + 1} />
      ))}
    </Paper>
  );
};

export default TaskSingle;
