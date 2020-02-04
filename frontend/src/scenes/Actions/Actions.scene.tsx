import React, { useState, useEffect } from "react";
import { createStyles, Theme, makeStyles, Typography } from "@material-ui/core";

import { startup } from "../../services/mdast/mdast.service";

const Actions: React.FC = () => {
  const classes = useStyles();

  const [doMd, setDoMd] = useState("");

  useEffect(() => {
    startup();
  }, []);

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

export default Actions;
