import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { AppState } from "../../store";
import TaskSingle, {
  TaskSingleActionSet,
} from "../TaskSingle/TaskSingle.scene";

const Do = () => {
  const nowIds = useSelector((state: AppState) => state.now.taskIds);
  const skipCount = useSelector((state: AppState) => state.now.skipCount);

  if (nowIds.length === 0) {
    return <Redirect to="/review" />;
  }

  const taskId = nowIds[skipCount];

  return <TaskSingle taskId={taskId} actionSet={TaskSingleActionSet.do} />;
};

export default Do;
