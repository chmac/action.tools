import React from "react";

import { createStyles, Theme, makeStyles, IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Notifications from "@material-ui/icons/Notifications";

import Log from "../Log/Log.scene";

const Bar: React.FC = (props) => {
  const classes = useStyles();
  const [logOpen, setLogOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            component="h1"
            color="inherit"
          >
            Do.md
          </Typography>
          <IconButton
            onClick={() => {
              setLogOpen(true);
            }}
          >
            <Notifications />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Log
        open={logOpen}
        onClose={() => {
          setLogOpen(false);
        }}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  })
);

export default Bar;
