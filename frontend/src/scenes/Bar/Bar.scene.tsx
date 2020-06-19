import {
  AppBar,
  Badge,
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, AppState } from "../../store";
import { toggleIsOpen } from "../LeftMenu/LeftMenu.state";
import Log from "../Log/Log.scene";

const Bar: React.FC = (props) => {
  const classes = useStyles();
  const [logOpen, setLogOpen] = React.useState(false);
  const nowCount = useSelector((state: AppState) => state.now.taskIds.length);
  const aheadCount = useSelector(
    (state: AppState) => state.storage.commitsAhead
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" onClick={() => dispatch(toggleIsOpen())}>
            <MenuIcon />
          </IconButton>
          <Typography
            className={classes.title}
            variant="h6"
            component="h1"
            color="inherit"
          >
            Do.md
          </Typography>
          <Button component={Link} to="/tasks" className={classes.hideOnSmall}>
            All
          </Button>
          <Button component={Link} to="/review" className={classes.hideOnSmall}>
            Plan
          </Button>
          <Button component={Link} to="/do">
            <Badge badgeContent={nowCount} color="primary">
              Do
            </Badge>
          </Button>
          <IconButton
            onClick={() => {
              setLogOpen(true);
            }}
          >
            <Badge badgeContent={aheadCount} color="secondary">
              <NotificationsIcon />
            </Badge>
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
    hideOnSmall: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
);

export default Bar;
