import { makeStyles, Paper, Snackbar, Typography } from "@material-ui/core";
import { green, lightBlue, orange, red } from "@material-ui/core/colors";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store";
import { selectAll, setFlashed } from "./Notifications.state";

const empty = {
  id: "",
  notice: {
    message: "",
    type: "info",
  },
  time: 0,
};

const Notifications = () => {
  const classes = useStyles();

  const current = useSelector((state: AppState) => {
    return selectAll(state).filter((notice) => !notice.flashed)[0] || empty;
  });
  const dispatch: AppDispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
    dispatch(setFlashed(current.id));
  }, [dispatch, current, setIsOpen]);

  useEffect(() => {
    if (current !== empty) {
      setIsOpen(true);
      setTimeout(close, 3e3);
    }
  }, [current, close]);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      message={current.notice.message}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      onClose={() => {
        close();
      }}
    >
      <Paper
        className={classNames([classes.base, classes[current.notice.type]])}
      >
        <Typography>{current.notice.message}</Typography>
      </Paper>
    </Snackbar>
  );
};

export default Notifications;

const useStyles = makeStyles((theme) => {
  return {
    base: {
      width: 300,
      padding: theme.spacing(2),
    },
    error: {
      backgroundColor: red[500],
    },
    warning: {
      backgroundColor: orange[500],
    },
    info: {
      backgroundColor: lightBlue[500],
    },
    success: {
      backgroundColor: green[500],
    },
  };
});
