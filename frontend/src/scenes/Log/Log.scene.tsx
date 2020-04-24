import * as React from "react";
import { makeStyles, Modal, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

type Props = {
  open: boolean;
};

const Log = (props: Props) => {
  const { open } = props;
  const classes = useStyles();
  const messages = useSelector(
    (state: AppState) => state.notifications.messages
  );

  return (
    <Modal open={open}>
      <Paper className={classes.root}>
        <Typography variant="h1">Log</Typography>
        <ul>
          {messages.map(({ message, type }, i) => (
            <li key={i}>
              {type}: {message}
            </li>
          ))}
        </ul>
      </Paper>
    </Modal>
  );
};

export default Log;

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "80vw",
      height: "80vh",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      padding: theme.spacing(2),
      flex: 1,
    },
  };
});
