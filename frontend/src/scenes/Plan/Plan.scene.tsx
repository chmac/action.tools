import { Typography, Button } from "@material-ui/core";
import dayjs from "dayjs";
import { selectTasksByDatesFactory, stringifyDayjs } from "do.md";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Plan = () => {
  const [startDate, setStartDate] = useState(stringifyDayjs(dayjs()));
  const selectTasksByDates = useMemo(() => {
    const dates = Array.from({ length: 7 }).map((_, index) => {
      return stringifyDayjs(dayjs(startDate).add(index, "day"));
    });
    return selectTasksByDatesFactory(dates);
  }, [startDate]);
  const days = useSelector(selectTasksByDates);

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
            setStartDate(stringifyDayjs(dayjs(startDate).subtract(7, "day")));
          }}
        >
          - 7
        </Button>{" "}
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setStartDate(stringifyDayjs(dayjs(startDate).add(7, "day")));
          }}
        >
          + 7
        </Button>
      </Typography>
    </div>
  );
};

export default Plan;
