import React from "react";

import { createStyles, Theme, makeStyles, Typography } from "@material-ui/core";

const Home: React.FC = props => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h1">Welcome</Typography>
      <Typography>
        Edit this page in <code>frontend/src/scenes/Home/Home.scene.tsx</code>
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {}
  })
);

export default Home;
