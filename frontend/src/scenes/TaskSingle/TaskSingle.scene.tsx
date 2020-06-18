import React from "react";
import { Paper, Typography, Button } from "@material-ui/core";

const TaskSingle = ({
  taskId,
  onDecisionMade,
}: {
  taskId: string;
  onDecisionMade: () => void;
}) => {
  return (
    <Paper>
      <Typography variant="h1">Task id {taskId}</Typography>
      <Button variant="outlined" onClick={() => onDecisionMade()}>
        Next
      </Button>
    </Paper>
  );
};

export default TaskSingle;
