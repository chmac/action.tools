import {
  Button,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  getMarkdown,
  pushToNewBranch,
  reset,
  wipe,
} from "../../services/storage/storage.service";
import { AppState } from "../../store";
import { selectAll } from "../Notifications/Notifications.state";
import { push } from "../../services/notifications/notifications.service";

type Props = {
  open: boolean;
  onClose: () => void;
};

const formatTimestamp = (time: number): string => {
  const d = new Date(time * 1e3);
  return `${d.getHours()}:${d.getMinutes()}`;
};

const buildTimeString = () => {
  const timestampString = process.env.REACT_APP_BUILD_TIME;
  if (typeof timestampString === "undefined") {
    return "now";
  }
  const timeMs = parseInt(timestampString) * 1e3;
  var d = new Date(timeMs);
  return d.toString();
};

const Log = (props: Props) => {
  const { open, onClose } = props;
  const classes = useStyles();
  const messages = useSelector(selectAll);
  const lastCommitHash = useSelector(
    (state: AppState) => state.storage.lastCommitHash
  );
  const buildTime = useCallback(buildTimeString, []);
  const [fullMarkdown, setFullMarkdown] = useState("");

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
          GLOBAL: n - new task; c - new task form;
          <br />
          NAV: ga - all task; gr - review; gd - do; gp - plan
          <br />
          PLAN: j - done; k - now; l - tomorrow; ; - later
          <br />
          REVIEW: shift+a - show all
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
        <Typography variant="h1">Markdown</Typography>
        <Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={async () => {
              try {
                const branchName = await pushToNewBranch();
                push({
                  message: `Successfully pushed to origin/${branchName} #2kLFyl`,
                  type: "success",
                });
              } catch (error) {
                if (error instanceof Error) {
                  push({
                    message: `Error pushing #XVQ8ck: ${error.message}`,
                    type: "error",
                  });
                } else {
                  push({
                    message: `Unknown type of error pushing #XgnyNW ${error}`,
                    type: "error",
                  });
                }
              }
            }}
          >
            Push to new branch
          </Button>
        </Typography>
        <Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={async () => {
              const md = await getMarkdown();
              setFullMarkdown(md);
            }}
          >
            Load do.md
          </Button>
        </Typography>
        <Typography>
          {fullMarkdown === "" ? null : <textarea value={fullMarkdown} />}
        </Typography>
        <Typography variant="h1" className={classes.danger}>
          Danger
        </Typography>
        <Typography>
          Version: {process.env.REACT_APP_VERSION_GIT || "dev"}
          <br />
          Build time: {buildTime()}
        </Typography>
        <Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              wipe();
            }}
          >
            Wipe Storage
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              reset();
            }}
          >
            Reset Everything
          </Button>
        </Typography>
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
      [theme.breakpoints.down("sm")]: {
        top: "53%",
        width: "95vw",
        height: "90vh",
      },
      padding: theme.spacing(2),
      flex: 1,
      overflowY: "scroll",
    },
    danger: {
      color: red[900],
    },
  };
});
