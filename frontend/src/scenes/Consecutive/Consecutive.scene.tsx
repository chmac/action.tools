import { makeActionableTodaySelector } from "do.md";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { Paper, Typography } from "@material-ui/core";

/**
 * - Get tasks which are actionable today
 * - Show them one at a time
 *   - Add actions to the single view
 *   - Each action proceeds to the next in the list
 */

const Consecutive = () => {
  const actionableTodaySelector = useMemo(
    () => makeActionableTodaySelector(),
    []
  );
  const tasks = useSelector((state: AppState) =>
    actionableTodaySelector(state)
  );

  return (
    <Paper elevation={1}>
      <ul>
        {tasks.map((task) => {
          return (
            <li key={task.id}>
              <Typography>
                {task.contentMarkdown} - {JSON.stringify(task.data)}
              </Typography>
            </li>
          );
        })}
      </ul>
    </Paper>
  );
};

export default Consecutive;
