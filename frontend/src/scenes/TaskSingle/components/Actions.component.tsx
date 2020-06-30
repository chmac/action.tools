import { Button, makeStyles, Paper } from "@material-ui/core";
import { pink, lightGreen } from "@material-ui/core/colors";
import classNames from "classnames";
import { finishTask, snoozeTask } from "do.md";
import mousetrap from "mousetrap";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addId } from "../../../services/now/now.state";
import { AppDispatch } from "../../../store";

const snoozeDayOptions = [5, 7, 9, 14, 30, "?"];

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
  const [showNumbers, setShowNumbers] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const handleKey = useCallback(
    (key: KEY) => {
      switch (key) {
        case KEY.j: {
          setShowNumbers(false);
          dispatch(finishTask(taskId));
          break;
        }
        case KEY.k: {
          setShowNumbers(false);
          dispatch(addId(taskId));
          break;
        }
        case KEY.l: {
          setShowNumbers(false);
          dispatch(snoozeTask({ id: taskId, daysFromToday: 1 }));
          break;
        }
        case KEY.semi: {
          setShowNumbers(false);
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

  const handleDays = useCallback(
    (days: string | number) => {
      if (typeof days === "string") {
        setShowNumbers(false);
        const daysFromToday = parseInt(prompt("How many days hence?") || "0");
        if (daysFromToday > 0) {
          dispatch(snoozeTask({ id: taskId, daysFromToday }));
        }
      } else {
        dispatch(snoozeTask({ id: taskId, daysFromToday: days }));
      }
      setShowNumbers(false);
    },

    [dispatch, setShowNumbers, taskId]
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
        <div
          className={classNames({
            [classes.dayWrapper]: true,
            [classes.hidden]: !showNumbers,
          })}
        >
          {snoozeDayOptions.map((days) => {
            return (
              <Button
                key={days}
                variant="outlined"
                classes={{
                  root: classes.days,
                  label: classes.daysLabel,
                }}
                onClick={() => handleDays(days)}
              >
                {days}
              </Button>
            );
          })}
        </div>
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
            setShowNumbers(!showNumbers);
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
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      backgroundColor: pink[50],
    },
    dayWrapper: {
      // Pull the top down to hide the top of the actionWrapper
      marginTop: theme.spacing(-1),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      backgroundColor: lightGreen[50],
    },
    hidden: {
      display: "none",
    },
    days: {
      minWidth: 35,
      marginLeft: theme.spacing(0.5),
      marginRigh: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    daysLabel: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    actions: {
      width: 120,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  };
});
