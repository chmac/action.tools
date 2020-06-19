import { makeStyles, Modal, Paper, Typography } from "@material-ui/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { selectAll } from "../Notifications/Notifications.state";

type Props = {
  open: boolean;
  onClose: () => void;
};

const formatTimestamp = (time: number): string => {
  const d = new Date(time * 1e3);
  return `${d.getHours()}:${d.getMinutes()}`;
};

const Log = (props: Props) => {
  const { open, onClose } = props;
  const classes = useStyles();
  const messages = useSelector(selectAll);
  const lastCommitHash = useSelector(
    (state: AppState) => state.storage.lastCommitHash
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <Paper className={classes.root}>
        <Typography variant="h1">Shortcuts</Typography>
        <Typography>
          GLOBAL: n - new task;
          <br />
          PLAN: j - never; k - now; l - tomorrow; ; - later
        </Typography>
        <Typography variant="h1">Stats</Typography>
        <ul>
          <li>Current local commit: {lastCommitHash.substr(0, 6)}</li>
        </ul>

        <Typography variant="h1">Log</Typography>
        <ul>
          {messages.map(({ notice: { message, type }, time }, i) => (
            <Typography component="li" key={i}>
              {formatTimestamp(time)} - {type}: {message}
            </Typography>
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
