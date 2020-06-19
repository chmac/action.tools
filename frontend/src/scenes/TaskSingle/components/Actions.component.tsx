import { Button, makeStyles, Paper } from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { finishTask, snoozeTask } from "do.md";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addId } from "../../../services/now/now.state";
import { AppDispatch } from "../../../store";
import mousetrap from "mousetrap";

const assertNever = (no: never): never => {
  throw new Error("assertNever #pcQASS");
};

enum KEY {
  j = "j",
  k = "k",
  l = "l",
  semi = ";",
}
const keys = Object.values(KEY);

const Actions = ({ taskId }: { taskId: string }) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const handleKey = useCallback(
    (key: KEY) => {
      switch (key) {
        case KEY.j: {
          dispatch(finishTask(taskId));
          break;
        }
        case KEY.k: {
          dispatch(addId(taskId));
          break;
        }
        case KEY.l: {
          dispatch(snoozeTask({ id: taskId, daysFromToday: 1 }));
          break;
        }
        case KEY.semi: {
          const daysFromToday = parseInt(prompt("How many days hence?") || "0");
          if (daysFromToday > 0) {
            dispatch(snoozeTask({ id: taskId, daysFromToday }));
          }
          break;
        }
        default: {
          assertNever(key);
        }
      }
    },
    [taskId, dispatch]
  );

  useEffect(() => {
    mousetrap.bind(keys, (event, key) => {
      handleKey(key as KEY);
    });
    return () => {
      mousetrap.unbind(keys);
    };
  });

  return (
    <>
      <Paper className={classes.actionWrapper}>
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => handleKey(KEY.j)}
        >
          Never
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => handleKey(KEY.k)}
        >
          Now
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            handleKey(KEY.l);
          }}
        >
          Tomorrow
        </Button>{" "}
        <Button
          variant="outlined"
          size="large"
          className={classes.actions}
          onClick={() => {
            handleKey(KEY.semi);
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
