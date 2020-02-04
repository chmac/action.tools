import React from "react";
import { connect } from "react-redux";

import {
  Button,
  createStyles,
  Theme,
  WithStyles,
  withStyles
} from "@material-ui/core";

import { showLock } from "../../services/auth/auth.service";
import { AppState } from "../../store";

const Home: React.FC<Props> = props => {
  const { classes, isLoggedIn } = props;

  if (!isLoggedIn) {
    return (
      <div className={classes.anonContainer}>
        <p>Login to get started.</p>
        <Button
          variant="contained"
          size="large"
          onClick={event => {
            event.preventDefault();
            showLock();
          }}
        >
          Login or Sign Up
        </Button>
        <p>
          Edit this page in <code>frontend/src/scenes/Home/Home.scene.tsx</code>
        </p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <h1>You're logged in</h1>
      <p>
        Edit this page in <code>frontend/src/scenes/Home/Home.scene.tsx</code>
      </p>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.auth.isLoggedIn
  };
};

const styles = (theme: Theme) =>
  createStyles({
    anonContainer: {
      paddingTop: "10vh",
      textAlign: "center",
      fontSize: "3em"
    },
    container: {}
  });

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & WithStyles<typeof styles>;

export default connect(mapStateToProps)(withStyles(styles)(Home));
