import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { AppState } from "../../store";
import TaskSingle, { ActionSet } from "../TaskSingle/TaskSingle.scene";

const Do = () => {
  const nowIds = useSelector((state: AppState) => state.now.taskIds);

  if (nowIds.length === 0) {
    return <Redirect to="/review" />;
  }

  return <TaskSingle taskId={nowIds[0]} actionSet={ActionSet.do} />;
};

export default Do;
