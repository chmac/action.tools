import { makeStyles } from "@material-ui/core";
import { domdReduxKey } from "do.md";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import SectionScene from "./scenes/Section/Section.scene";

const AllTasks = () => {
  const classes = useStyles();
  const { sections } = useSelector((state: AppState) => {
    return {
      sections: state[domdReduxKey].data.sections,
    };
  });

  return (
    <div className={classes.page}>
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
