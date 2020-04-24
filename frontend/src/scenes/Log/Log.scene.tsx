import * as React from "react";
import { makeStyles, Modal, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

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
  const messages = useSelector((state: AppState) => state.notifications.log);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <Paper className={classes.root}>
        <Typography variant="h1">Log</Typography>
        <ul>
          {messages.map(({ message: { message, type }, time }, i) => (
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
