import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { createStyles, withStyles, WithStyles, Theme } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { AppState } from "../../store";
import { showLock, logout } from "../../services/auth/auth.service";
import { doesUserHaveRole } from "../../services/auth/auth.state";

const Bar: React.FC<Props> = props => {
  const { classes, isLoggedIn, isAdmin } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Link to="/" className={classes.title}>
            <Typography variant="h6" component="h1" color="inherit">
              App Header
            </Typography>
          </Link>
          {isAdmin ? (
            <Link to="/admin/route">
              <Button color="inherit">Admin Link</Button>
            </Link>
          ) : null}
          {isLoggedIn ? (
            <>
              <Link to="/authenticated/route">
                <Button color="inherit">Logged In</Button>
              </Link>
              <Button
                color="inherit"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                showLock();
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    isAdmin: doesUserHaveRole(state, "admin")
  };
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1
    }
  });

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & WithStyles<typeof styles>;

export default connect(mapStateToProps)(withStyles(styles)(Bar));
