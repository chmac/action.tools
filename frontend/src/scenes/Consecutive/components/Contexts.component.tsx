import { makeStyles, Switch, Typography } from "@material-ui/core";
import {
  addContext,
  allContexts,
  removeContext,
  getPackageState,
  constants,
} from "do.md";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../store";
import { intersection, difference } from "remeda";

const Contexts = () => {
  const classes = useStyles();
  // These are all the possible context values available
  const allContextsFromTasks = useSelector(allContexts);
  // These are the currently active "filters"
  const currentContexts = useSelector(
    (state: AppState) => getPackageState(state).query.currentContexts
  );
  const dispatch: AppDispatch = useDispatch();
  // These are the "positive" context filters
  const positiveContexts = difference(
    allContextsFromTasks,
    constants.EXCLUDED_BY_DEFAULT_CONTEXTS
  );
  // These are the "negative" contexts
  const negativeContexts = intersection(
    allContextsFromTasks,
    constants.EXCLUDED_BY_DEFAULT_CONTEXTS
  );

  const positive = positiveContexts.map((c): [string, boolean] => {
    const enabled = currentContexts.includes(c);
    return [c, enabled];
  });
  const negative = negativeContexts.map((c): [string, boolean] => {
    const enabled = currentContexts.includes(c);
    return [c, enabled];
  });

  return (
    <div>
      <Typography>
        Filter:
        {positive.map(([context, enabled]) => {
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
      <Typography>
        Exclude:
        {negative.map(([context, enabled]) => {
          return (
            <Fragment key={context}>
              <Switch
                checked={!enabled}
                defaultChecked
                onChange={(event) => {
                  if (!event.target.checked) {
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
