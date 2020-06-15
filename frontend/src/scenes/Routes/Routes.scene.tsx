import { createMuiTheme, createStyles, Theme } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { startup as domdStartup } from "do.md";
import { createBrowserHistory } from "history";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Router, Switch } from "react-router-dom";
import { SnackbarContainer } from "uno-material-ui";
import {
  getMarkdown,
  startup as storageStartup,
} from "../../services/storage/storage.service";
import { AppDispatch } from "../../store";
import Actions from "../Actions/Actions.scene";
import Bar from "../Bar/Bar.scene";
import Do from "../Do/Do.scene";
import Home from "../Home/Home.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

export const history = createBrowserHistory();

const Routes: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    storageStartup().then(async () => {
      const markdown = await getMarkdown();
      dispatch(domdStartup({ markdown }));
    });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarContainer />
      <Router history={history}>
        <Bar />
        <CssBaseline />
        <Container className={classes.container}>
          <Switch>
            <Route exact path="/" component={Do} />
            <Route exact path="/actions" component={Actions} />
            <Route exact path="/home" component={Home} />
          </Switch>
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
  })
);

export default Routes;
