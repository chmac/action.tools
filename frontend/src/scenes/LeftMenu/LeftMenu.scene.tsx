import {
  createStyles,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  makeStyles,
  Switch,
  Theme,
} from "@material-ui/core";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import ListIcon from "@material-ui/icons/List";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import TodayIcon from "@material-ui/icons/Today";
import { addContext, constants, getContexts, removeContext } from "do.md";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../store";
import { history } from "../Routes/Routes.scene";
import { toggleIsOpen } from "./LeftMenu.state";

const LeftMenu = () => {
  const classes = useStyles();
  const isOpen = useSelector((state: AppState) => state.LeftMenu.isOpen);
  const contexts = useSelector(getContexts);
  const dispatch: AppDispatch = useDispatch();

  const go = useCallback(
    (path: string) => {
      history.push(path);
      dispatch(toggleIsOpen());
    },
    [dispatch]
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={() => dispatch(toggleIsOpen())}
    >
      <List component="nav" classes={{ root: classes.listRoot }}>
        <ListItem
          button
          onClick={() => {
            go("/tasks");
          }}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="All" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            go("/review");
          }}
        >
          <ListItemIcon>
            <KeyboardTabIcon />
          </ListItemIcon>
          <ListItemText primary="Review" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            go("/do");
          }}
        >
          <ListItemIcon>
            <PlayCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Do" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            go("/plan");
          }}
        >
          <ListItemIcon>
            <TodayIcon />
          </ListItemIcon>
          <ListItemText primary="Plan" />
        </ListItem>
        <ListSubheader>Context</ListSubheader>
        {contexts.map(([context, enabled]) => {
          return (
            <ListItem key={context}>
              <ListItemText primary={`${constants.CONTEXT_PREFIX}${context}`} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={enabled}
                  onChange={(event) => {
                    dispatch(
                      event.target.checked
                        ? addContext(context)
                        : removeContext(context)
                    );
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default LeftMenu;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listRoot: {
      width: 240,
    },
    container: {
      flexGrow: 1,
    },
    loadingWrapper: {
      width: "100vw",
      height: "100vh",
      position: "absolute",
      top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: -1,
    },
  })
);
