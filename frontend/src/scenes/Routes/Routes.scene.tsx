import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { connect } from "react-redux";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  createMuiTheme
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { AppState } from "../../store";

import Bar from "../Bar/Bar.scene";
import Home from "../Home/Home.scene";

const baseTheme = createMuiTheme();
const theme = responsiveFontSizes(baseTheme);

export const history = createBrowserHistory();

const Routes = (props: Props) => {
  const { isLoggedIn } = props;

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Bar />
        <CssBaseline />
        <Container>
          {isLoggedIn ? (
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          ) : (
            <>
              <Home />
            </>
          )}
        </Container>
      </Router>
    </ThemeProvider>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      flexGrow: 1
    }
  });

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & WithStyles<typeof styles>;

export default connect(mapStateToProps)(withStyles(styles)(Routes));
