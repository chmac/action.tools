import { Button, makeStyles, Typography } from "@material-ui/core";
import { green, grey, red, yellow } from "@material-ui/core/colors";
import classNames from "classnames";
import dayjs from "dayjs";
import {
  selectTasksByDatesFactory,
  selectUndatedTasks,
  stringifyDayjs,
  Task,
} from "do.md";
import mousetrap from "mousetrap";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import EditButton from "../EditButton/EditButton.scene";
import SnoozeButton from "../SnoozeButton/SnoozeButton.scene";

const assertNever = (no: never): never => {
  throw new Error("assertNever #pcQASS");
};

enum KEY {
  j = "j",
  k = "k",
  l = "l",
}
const keys = Object.values(KEY);

const TaskLi = ({ task }: { task: Task }) => {
  const classes = useStyles();

  const words = task.contentMarkdown.split(" ");
  const prios = {
    p1: words.indexOf("p1") !== -1,
    p2: words.indexOf("p2") !== -1,
    p3: words.indexOf("p3") !== -1,
    p4: words.indexOf("p4") !== -1,
  };

  return (
    <Typography
      className={classNames({
        [classes.p1]: prios.p1,
        [classes.p2]: prios.p2,
        [classes.p3]: prios.p3,
        [classes.p4]: prios.p4,
      })}
      component="li"
      key={task.id}
    >
      {task.contentMarkdown} <EditButton taskId={task.id} />{" "}
      <SnoozeButton taskId={task.id} />
    </Typography>
  );
};

const Plan = () => {
  const classes = useStyles();
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
      <Typography variant="h1">Dates</Typography>
      {Object.entries(days).map(([day, tasks]) => {
        const hasTasks = tasks.length > 0;
        return (
          <div key={day}>
            <Typography variant="h2">{day}</Typography>
            <ul>
              {hasTasks ? (
                tasks.map((task) => <TaskLi key={task.id} task={task} />)
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
        {undatedTasks.map((task) => (
          <TaskLi key={task.id} task={task} />
        ))}
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
    p1: {
      backgroundColor: red[500],
    },
    p2: {
      backgroundColor: yellow[500],
    },
    p3: {
      backgroundColor: green[300],
    },
    p4: {
      backgroundColor: grey[300],
    },
  };
});
