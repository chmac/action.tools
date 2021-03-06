import { CircularProgress, createMuiTheme } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  makeStyles,
  responsiveFontSizes,
  Theme,
} from "@material-ui/core/styles";
import { createStyles, ThemeProvider } from "@material-ui/styles";
import { isReady } from "do.md";
import { createBrowserHistory } from "history";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import AllTasks from "../AllTasks/AllTasks.scene";
import Bar from "../Bar/Bar.scene";
import Do from "../Do/Do.scene";
import Home from "../Home/Home.scene";
import LeftMenu from "../LeftMenu/LeftMenu.scene";
import Notifications from "../Notifications/Notifications.scene";
import Plan from "../Plan/Plan.scene";
import Review from "../Review/Review.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

export const history = createBrowserHistory();

const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.loadingWrapper}>
      <CircularProgress size="6rem" />
    </div>
  );
};

const Routes: React.FC = () => {
  const classes = useStyles();
  const dataLoaded = useSelector(isReady);

  return (
    <ThemeProvider theme={theme}>
      <Notifications />
      <Router history={history}>
        <Bar />
        <LeftMenu />
        <CssBaseline />
        <Container className={classes.container}>
          {dataLoaded ? (
            <Switch>
              <Route exact path="/" component={() => <Redirect to="/do" />} />
              <Route exact path="/do" component={Do} />
              <Route exact path="/tasks" component={AllTasks} />
              <Route exact path="/review" component={Review} />
              <Route exact path="/plan" component={Plan} />
              <Route exact path="/home" component={Home} />
            </Switch>
          ) : (
            <Loading />
          )}
        </Container>
      </Router>
    </ThemeProvider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export default Routes;
