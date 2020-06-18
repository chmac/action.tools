import { makeStyles, Switch, Typography } from "@material-ui/core";
import { addContext, allContexts, removeContext, getPackageState } from "do.md";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../store";

const Contexts = () => {
  const classes = useStyles();
  const contextsFromTasks = useSelector(allContexts);
  const currentContexts = useSelector(
    (state: AppState) => getPackageState(state).query.currentContexts
  );
  const dispatch: AppDispatch = useDispatch();

  const renderContexts = contextsFromTasks.map((c): [string, boolean] => {
    const enabled = currentContexts.includes(c);
    return [c, enabled];
  });

  return (
    <div>
      <Typography>
        Contexts:
        {renderContexts.map(([context, enabled]) => {
          return (
            <Fragment key={context}>
              <Switch
                checked={enabled}
                onChange={(event) => {
                  if (event.target.checked) {
                    dispatch(addContext(context));
                  } else {
                    dispatch(removeContext(context));
                  }
                }}
              />{" "}
              {context}
            </Fragment>
          );
        })}
      </Typography>
    </div>
  );
};

export default Contexts;

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
  };
});
