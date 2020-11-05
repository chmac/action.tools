import { Button } from "@material-ui/core";
import { snoozeTask } from "do.md";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

const SnoozeButton = ({
  taskId,
  size = "small",
  variant = "outlined",
  className,
}: {
  taskId: string;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  className?: string;
}) => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      onClick={() => {
        const daysFromToday = parseInt(prompt("How many days hence?") || "0");
        if (daysFromToday > 0) {
          dispatch(snoozeTask({ id: taskId, daysFromToday }));
        }
      }}
    >
      Snooze
    </Button>
  );
};

export default SnoozeButton;
