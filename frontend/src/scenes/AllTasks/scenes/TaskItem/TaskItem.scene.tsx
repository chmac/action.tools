import { Checkbox, Paper, Typography } from "@material-ui/core";
import { createSelector } from "@reduxjs/toolkit";
import { finishTask, Task, TaskData, unfinishTask } from "do.md";
import Markdown from "markdown-to-jsx";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import EditButton from "../../../EditButton/EditButton.scene";

const makeChildTasksSelector = () =>
  createSelector(
    [
      (_state: AppState, parentId: string) => parentId,
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
          return <span key={key}>{`@${(value as string[]).join(" @")}`}</span>;
        }
        return (
          <span key={key}>
            {key}: {value}{" "}
          </span>
        );
      })}
    </>
  );
};

const TaskItem = ({ task, depth = 0 }: { task: Task; depth?: number }) => {
  const selectChildTasks = useMemo(makeChildTasksSelector, []);
  const tasks = useSelector((state: AppState) =>
    selectChildTasks(state, task.id)
  );
  const dispatch = useDispatch<AppDispatch>();

  // Show this task wrapped in an outline if it is either not a task, or it is a
  // sequential task
  const hideOutline = !task.isTask || task.isSequential;

  return (
    <Paper
      variant={hideOutline ? "elevation" : "outlined"}
      elevation={hideOutline ? 0 : undefined}
      square
      style={{
        paddingLeft: depth * 42 + (task.isTask ? 0 : 42),
      }}
    >
      <Typography>
        {task.isTask ? (
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
        ) : null}
        <Markdown options={{ forceInline: true }}>
          {task.contentMarkdown}
        </Markdown>
        <Data data={task.data} />{" "}
        {task.isTask ? <EditButton taskId={task.id} /> : null}
      </Typography>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} depth={depth + 1} />
      ))}
    </Paper>
  );
};

export default TaskItem;
