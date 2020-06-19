import {
  FormControlLabel,
  FormGroup,
  makeStyles,
  Switch,
} from "@material-ui/core";
import {
  addContext,
  allContexts,
  constants,
  getPackageState,
  removeContext,
} from "do.md";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { uniq } from "remeda";
import { AppDispatch, AppState } from "../../../store";

const Contexts = () => {
  const classes = useStyles();
  // These are all the possible context values available
  const allContextsFromTasks = useSelector(allContexts);
  // These are the currently active "filters"
  const currentContexts = useSelector(
    (state: AppState) => getPackageState(state).query.currentContexts
  );
  const dispatch: AppDispatch = useDispatch();

  const renderContexts = uniq(
    allContextsFromTasks.concat(constants.EXCLUDED_BY_DEFAULT_CONTEXTS)
  )
    .sort()
    .map((context): [string, boolean] => {
      const enabled = currentContexts.includes(context);
      return [context, enabled];
    });

  return (
    <FormGroup row classes={{ root: classes.wrapper }}>
      {renderContexts.map(([context, enabled]) => {
        return (
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={(event) => {
                  if (event.target.checked) {
                    dispatch(addContext(context));
                  } else {
                    dispatch(removeContext(context));
                  }
                }}
              />
            }
            label={`${constants.CONTEXT_PREFIX}${context}`}
          />
        );
      })}
    </FormGroup>
  );
};

export default Contexts;

const useStyles = makeStyles((theme) => {
  return {
    wrapper: { justifyContent: "center" },
    paper: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
  };
});
