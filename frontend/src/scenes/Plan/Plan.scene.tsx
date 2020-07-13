import { Button, makeStyles, Typography } from "@material-ui/core";
import dayjs from "dayjs";
import {
  selectTasksByDatesFactory,
  selectUndatedTasks,
  stringifyDayjs,
} from "do.md";
import mousetrap from "mousetrap";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { openEdit } from "../TaskForm/TaskForm.state";

const assertNever = (no: never): never => {
  throw new Error("assertNever #pcQASS");
};

enum KEY {
  j = "j",
  k = "k",
  l = "l",
}
const keys = Object.values(KEY);

const Plan = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [startDate, setStartDate] = useState(stringifyDayjs(dayjs()));
  const selectTasksByDates = useMemo(() => {
    const dates = Array.from({ length: 7 }).map((_, index) => {
      return stringifyDayjs(dayjs(startDate).add(index, "day"));
    });
    return selectTasksByDatesFactory(dates);
  }, [startDate]);
  const days = useSelector(selectTasksByDates);
  const undatedTasks = useSelector(selectUndatedTasks);

  const handler = useCallback(
    (key: KEY) => {
      switch (key) {
        case KEY.k: {
          setStartDate(stringifyDayjs(dayjs(startDate).subtract(7, "day")));
          break;
        }
        case KEY.j: {
          setStartDate(stringifyDayjs(dayjs(startDate).add(7, "day")));
          break;
        }
        case KEY.l: {
          setStartDate(stringifyDayjs(dayjs()));
          break;
        }
        default: {
          assertNever(key);
        }
      }
    },
    [startDate, setStartDate]
  );

  useEffect(() => {
    mousetrap.bind(keys, (event, key) => {
      handler(key as KEY);
    });
    return () => {
      mousetrap.unbind(keys);
    };
  }, [handler]);

  return (
    <div>
      {Object.entries(days).map(([day, tasks]) => {
        const hasTasks = tasks.length > 0;
        return (
          <div key={day}>
            <Typography variant="h2">{day}</Typography>
            <ul>
              {hasTasks ? (
                tasks.map((task) => {
                  return (
                    <Typography
                      component="li"
                      key={task.id}
                      onClick={() => {
                        dispatch(openEdit(task.id));
                      }}
                    >
                      {task.contentMarkdown}
                    </Typography>
                  );
                })
              ) : (
                <li className={classes.noTasks}>No tasks</li>
              )}
            </ul>
          </div>
        );
      })}
      <Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            handler(KEY.k);
          }}
        >
          - 7
        </Button>{" "}
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            handler(KEY.l);
          }}
        >
          0
        </Button>{" "}
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            handler(KEY.j);
          }}
        >
          + 7
        </Button>
      </Typography>
      <Typography variant="h1">Undated</Typography>
      <ul>
        {undatedTasks.map((task) => {
          return (
            <Typography component="li" key={task.id}>
              {task.contentMarkdown}
            </Typography>
          );
        })}
      </ul>
    </div>
  );
};

export default Plan;

const useStyles = makeStyles((theme) => {
  return {
    noTasks: {
      opacity: 0.5,
    },
  };
});
