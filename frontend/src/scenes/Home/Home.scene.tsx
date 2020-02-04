import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core";

const Home: React.FC = props => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h1>You're logged in</h1>
      <p>
        Edit this page in <code>frontend/src/scenes/Home/Home.scene.tsx</code>
      </p>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    anonContainer: {
      paddingTop: "10vh",
      textAlign: "center",
      fontSize: "3em"
    },
    container: {}
  })
);

export default Home;
