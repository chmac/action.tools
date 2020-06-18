import { makeStyles, Typography } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import dayjs from "dayjs";
import { constants, getPackageState as getDomdState, TaskData } from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";

const DateField = ({ name, date }: { name: string; date: string }) => {
  const classes = useStyles();

  const today = useSelector(
    (state: AppState) => getDomdState(state).query.today
  );

  const daysFromToday = dayjs(date).diff(dayjs(today), "day");

  const isOverdue = name === constants.BY && daysFromToday <= 0;

  return (
    <>
      {name} {date}{" "}
      <span className={isOverdue ? classes.overdue : ""}>
        ({daysFromToday} days)
      </span>
    </>
  );
};

const Data = ({ data }: { data: TaskData }) => {
  const classes = useStyles();

  return (
    <ul>
      {Object.entries(data).map(([key, value]) => {
        if (key === "contexts") {
          return (
            <li key="key" className={`${classes.li} ${classes.light}`}>
              <Typography>@{(value as string[]).join(" @")}</Typography>
            </li>
          );
        }

        if (key === constants.REPEAT) {
          return (
            <li key={key} className={classes.li}>
              <Typography>
                {key} {value}
              </Typography>
            </li>
          );
        }

        const className =
          key === constants.CREATED
            ? [classes.li, classes.light].join(" ")
            : classes.li;

        return (
          <li key={key} className={className}>
            <Typography>
              <DateField name={key} date={value as string} />
            </Typography>
          </li>
        );
      })}
    </ul>
  );
};

export default Data;

const useStyles = makeStyles((theme) => {
  return {
    li: { lineHeight: `${16 * 2}px` },
    light: { opacity: 0.6 },
    overdue: {
      color: red[900],
      fontWeight: 700,
      fontSize: "1.5em",
    },
  };
});
