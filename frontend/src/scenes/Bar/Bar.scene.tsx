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
import AddIcon from "@material-ui/icons/Add";
import { createId, newTask } from "do.md";
import mousetrap from "mousetrap";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, AppState } from "../../store";
import { toggleIsOpen } from "../LeftMenu/LeftMenu.state";
import Log from "../Log/Log.scene";
import { history } from "../Routes/Routes.scene";
import TaskForm from "../TaskForm/TaskForm.scene";
import { openNew } from "../TaskForm/TaskForm.state";

const assertNever = (no: never): never => {
  throw new Error("assertNever #pcQASS");
};

enum KEY {
  c = "c",
  n = "n",
  question = "?",
  goAll = "g a",
  goReview = "g r",
  goDo = "g d",
  goPlan = "g p",
}
const keys = Object.values(KEY);

const Bar: React.FC = (props) => {
  const classes = useStyles();
  const [logOpen, setLogOpen] = React.useState(false);

  const dispatch: AppDispatch = useDispatch();

  const handler = useCallback(
    (key: KEY) => {
      switch (key) {
        case KEY.question: {
          setLogOpen(true);
          break;
        }
        case KEY.c: {
          dispatch(openNew());
          break;
        }
        case KEY.n: {
          const text = globalThis.prompt("Enter task text");
          if (typeof text === "string" && text.length > 0) {
            const id = createId();
            dispatch(
              newTask({
                task: {
                  contentMarkdown: text,
                  finished: false,
                  isSequential: false,
                  isTask: true,
                  data: { id },
                  sectionId: "top",
                  parentId: "",
                  id,
                },
                insertAtIndex: 0,
              })
            );
          }
          break;
        }
        case KEY.goAll: {
          history.push("/tasks");
          break;
        }
        case KEY.goReview: {
          history.push("/review");
          break;
        }
        case KEY.goDo: {
          history.push("/do");
          break;
        }
        case KEY.goPlan: {
          history.push("/plan");
          break;
        }
        default: {
          assertNever(key);
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    mousetrap.bind(keys, (event, key) => {
      handler(key as KEY);
    });
    return () => {
      mousetrap.unbind(keys);
    };
  }, [handler]);

  const nowCount = useSelector((state: AppState) => state.now.taskIds.length);
  const aheadCount = useSelector(
    (state: AppState) => state.storage.commitsAhead
  );

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
            Review
          </Button>
          <Button component={Link} to="/do">
            <Badge badgeContent={nowCount} color="primary">
              Do
            </Badge>
          </Button>
          <IconButton
            onClick={() => {
              handler(KEY.c);
            }}
          >
            <AddIcon />
          </IconButton>
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
      <TaskForm />
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
