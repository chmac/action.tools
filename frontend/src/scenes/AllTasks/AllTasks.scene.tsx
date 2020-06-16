import { makeStyles, Typography } from "@material-ui/core";
import { REDUX_ROOT_KEY } from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import SectionScene from "./scenes/Section/Section.scene";

const AllTasks = () => {
  const classes = useStyles();
  const { sections } = useSelector((state: AppState) => {
    return {
      sections: state[REDUX_ROOT_KEY].data.sections,
    };
  });

  return (
    <div className={classes.page}>
      <Typography variant="h1">Tasks</Typography>
      {sections.map((section) => (
        <SectionScene key={section.id} section={section} />
      ))}
    </div>
  );
};

export default AllTasks;

const useStyles = makeStyles((theme) => ({
  page: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  paper: {
    padding: theme.spacing(2),
  },
  date: {
    width: 100,
  },
  markdown: {
    minHeight: "100vh",
  },
  bottomActions: {
    marginTop: 100,
    padding: theme.spacing(2),
  },
}));
