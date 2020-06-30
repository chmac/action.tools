import { Typography, Button } from "@material-ui/core";
import dayjs from "dayjs";
import { selectTasksByDatesFactory, stringifyDayjs } from "do.md";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import mousetrap from "mousetrap";

const assertNever = (no: never): never => {
  throw new Error("assertNever #pcQASS");
};

enum KEY {
  j = "j",
  k = "k",
}
const keys = Object.values(KEY);

const Plan = () => {
  const [startDate, setStartDate] = useState(stringifyDayjs(dayjs()));
  const selectTasksByDates = useMemo(() => {
    const dates = Array.from({ length: 7 }).map((_, index) => {
      return stringifyDayjs(dayjs(startDate).add(index, "day"));
    });
    return selectTasksByDatesFactory(dates);
  }, [startDate]);
  const days = useSelector(selectTasksByDates);

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
                    <Typography component="li" key={task.id}>
                      {task.contentMarkdown}
                    </Typography>
                  );
                })
              ) : (
                <li>No tasks</li>
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
            handler(KEY.j);
          }}
        >
          - 7
        </Button>{" "}
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            handler(KEY.k);
          }}
        >
          + 7
        </Button>
      </Typography>
    </div>
  );
};

export default Plan;
