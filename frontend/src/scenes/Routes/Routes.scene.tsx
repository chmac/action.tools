import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { createStyles, Theme, createMuiTheme } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { responsiveFontSizes, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Bar from "../Bar/Bar.scene";
import Home from "../Home/Home.scene";
import Actions from "../Actions/Actions.scene";
import Do from "../Do/Do.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

export const history = createBrowserHistory();

const Routes: React.FC = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Bar />
        <CssBaseline />
        <Container className={classes.container}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/actions" component={Actions} />
            <Route exact path="/do" component={Do} />
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      flexGrow: 1
    }
  })
);

export default Routes;
