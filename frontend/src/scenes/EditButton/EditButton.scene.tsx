import { Button } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { openEdit } from "../TaskForm/TaskForm.state";

const EditButton = ({
  taskId,
  size = "small",
  variant = "outlined",
}: {
  taskId: string;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
}) => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => {
        dispatch(openEdit(taskId));
      }}
    >
      Edit
    </Button>
  );
};

export default EditButton;
