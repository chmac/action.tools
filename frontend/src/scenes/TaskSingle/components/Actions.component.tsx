import { ShortcutMap, useShortcuts } from "@cutting/use-shortcuts";
import { Button, makeStyles, Paper } from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { finishTask, snoozeTask } from "do.md";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addId } from "../../../services/now/now.state";
import { AppDispatch } from "../../../store";

const shortcutMap: ShortcutMap = {
  j: "j",
  k: "k",
  l: "l",
  semi: ";",
  question: "?",
};

const Actions = ({ taskId }: { taskId: string }) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const handleClick = useCallback(
    (key: string) => {
      switch (key) {
        case "j": {
          dispatch(finishTask(taskId));
          break;
        }
        case "k": {
          dispatch(addId(taskId));
          break;
        }
        case "l": {
          dispatch(snoozeTask({ id: taskId, daysFromToday: 1 }));
          break;
        }
        case "semi": {
          const daysFromToday = parseInt(prompt("How many days hence?") || "0");
          if (daysFromToday > 0) {
            dispatch(snoozeTask({ id: taskId, daysFromToday }));
          }
          break;
        }
        case "question": {
          alert(`j - never; k - now; l - tomorrow; ; - later`);
        }
      }
    },
    [taskId, dispatch]
  );

  useShortcuts({
    shortcutMap,
    handler: (action, event) => {
      handleClick(action.type);
    },
  });

  return (
    <>
      <Paper className={classes.actionWrapper}>
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => handleClick("j")}
        >
          Never
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => handleClick("k")}
        >
          Now
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            handleClick("l");
          }}
        >
          Tomorrow
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            handleClick("semi");
          }}
        >
          Later
        </Button>
      </Paper>
    </>
  );
};

export default Actions;

const useStyles = makeStyles((theme) => {
  return {
    actionWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100vw",
      textAlign: "center",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      backgroundColor: pink[50],
    },
    actions: {
      width: 120,
      marginLeft: theme.spacing(2),
      marginRigh: theme.spacing(2),
    },
  };
});
