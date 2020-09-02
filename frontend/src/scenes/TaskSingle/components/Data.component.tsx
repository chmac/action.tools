import { makeStyles, Typography } from "@material-ui/core";
import { orange, red } from "@material-ui/core/colors";
import classNames from "classnames";
import {
  constants,
  dateToHuman,
  getPackageState as getDomdState,
  TaskData,
} from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";

const DateField = ({ name, date }: { name: keyof TaskData; date: string }) => {
  const classes = useStyles();

  const today = useSelector(
    (state: AppState) => getDomdState(state).query.today
  );

  const { isOverdue, isToday, isThisWeek, todayText } = dateToHuman({
    date,
    today,
    dateType: name as typeof constants.BY | typeof constants.AFTER,
  });

  return (
    <li
      className={classNames({
        [classes.li]: true,
        [classes.light]: name === constants.CREATED,
        [classes.liThisWeek]: isThisWeek,
        [classes.liToday]: isToday,
      })}
    >
      <Typography
        className={classNames({
          [classes.liOverdue]: isOverdue,
        })}
      >
        {name} {date}{" "}
        <span className={classNames({ [classes.overdue]: isOverdue })}>
          ({todayText})
        </span>
      </Typography>
    </li>
  );
};

const Data = ({ data }: { data: TaskData }) => {
  const classes = useStyles();

  return (
    <ul>
      {Object.entries(data).map(([key, value]) => {
        if (key === "contexts") {
          return (
            <li key="key" className={classNames(classes.li, classes.light)}>
              <Typography>@{(value as string[]).join(" @")}</Typography>
            </li>
          );
        }

        if (key === constants.REPEAT || key === constants.ID) {
          return (
            <li key={key} className={classes.li}>
              <Typography>
                {key} {value}
              </Typography>
            </li>
          );
        }

        return <DateField key={key} name={key} date={value as string} />;
      })}
    </ul>
  );
};

export default Data;

const useStyles = makeStyles((theme) => {
  return {
    li: { lineHeight: `${16 * 2}px` },
    liOverdue: {
      backgroundColor: red[100],
    },
    liToday: {
      backgroundColor: orange[500],
    },
    liThisWeek: {
      backgroundColor: orange[100],
    },
    light: { opacity: 0.6 },
    overdue: {
      color: red[900],
      fontWeight: 700,
      fontSize: "1.5em",
    },
  };
});
