import {
  Button,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import CheckBox from "@material-ui/icons/CheckBox";
import Close from "@material-ui/icons/Close";
import dayjs from "dayjs";
import {
  createId,
  finishTask,
  getRepeatParams,
  newTask,
  stringifyDayjs,
  Task,
  taskById,
  TaskData,
  updateTask,
  closeTaskWithoutRepeating,
} from "do.md";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { AppDispatch, AppState } from "../../store";
import { close } from "./TaskForm.state";

const isOnlyNumbers = (input: string) => input.match(/^[\d]+$/) !== null;

// Accept a number or a valid date
const isValidDate = (date?: string) => {
  if (typeof date === "undefined") {
    return true;
  }
  if (!isOnlyNumbers(date)) {
    return dayjs(date).isValid();
  }
  const asInt = parseInt(date);
  if (asInt > -1) {
    return true;
  }
  return false;
};

const schema = yup.object().shape({
  title: yup.string().required(),
  after: yup
    .string()
    .test("after-valid", "After is not a valid date", isValidDate),
  by: yup.string().test("by-valid", "By is not a valid date", isValidDate),
  // snooze: yup
  //   .string()
  //   .test("snooze-valid", "Snooze is not a valid date", isValidDate),
  contexts: yup.string(),
  repeat: yup
    .string()
    .test("repeat-valid", "Repeat string is not valid", (s) => {
      if (typeof s === "undefined" || s.length === 0) {
        return true;
      }
      try {
        getRepeatParams(s);
      } catch (error) {
        return false;
      }
      return true;
    }),
});

const TaskForm = () => {
  const classes = useStyles();
  const isOpen = useSelector((state: AppState) => state.TaskForm.isOpen);
  const editingTaskId = useSelector(
    (state: AppState) => state.TaskForm.editingTaskId
  );
  const editingTask = useSelector((state: AppState) => {
    if (editingTaskId === "") {
      return;
    }
    return taskById(state, editingTaskId);
  });
  const dispatch: AppDispatch = useDispatch();

  const isEditMode = typeof editingTask !== "undefined";
  const hasRepeat =
    typeof editingTask !== "undefined" &&
    typeof editingTask.data.repeat !== "undefined" &&
    editingTask.data.repeat.length > 0;

  const initialValues = {
    title: editingTask?.contentMarkdown || "",
    after: editingTask?.data.after || "",
    by: editingTask?.data.by || "",
    // The snooze date is not in the form right now
    // snooze: editingTask?.data.snooze || "",
    contexts: editingTask?.data.contexts?.join(", ") || "",
    repeat: editingTask?.data.repeat || "",
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        dispatch(close());
      }}
    >
      <Paper className={classes.root}>
        <Typography variant="h1">
          {isEditMode ? "Edit" : "Create"} a task
        </Typography>
        {typeof editingTask !== "undefined" ? (
          <Typography className={classes.done}>
            <Button
              variant="outlined"
              size="large"
              color="default"
              disabled={editingTask.finished}
              onClick={() => {
                dispatch(finishTask(editingTaskId));
                dispatch(close());
              }}
            >
              <CheckBox /> Mark task as done
            </Button>
          </Typography>
        ) : null}
        <Formik
          // NOTE: This must match schema, a value for every field, or the
          // onSubmit() hook will never be called and silently fail.
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={(values, helpers) => {
            type Fields = "after" | "by" | "contexts" | "repeat";
            const data = ([
              "after",
              "by",
              "contexts",
              "repeat",
            ] as Fields[]).reduce<TaskData>((data, name) => {
              if (typeof values[name] !== "undefined") {
                // NOTE: It's important to set empty strings if the fields are
                // empty, as the reducer uses empty strings to remove existing
                // fields.

                switch (name) {
                  case "after":
                  case "by": {
                    if (values[name] === "") {
                      return { ...data, [name]: "" };
                    }

                    if (isOnlyNumbers(values[name])) {
                      const asInt = parseInt(values[name]);
                      if (asInt > -1) {
                        return {
                          ...data,
                          [name]: stringifyDayjs(dayjs().add(asInt, "day")),
                        };
                      }
                    }
                    return { ...data, [name]: values[name] };
                  }
                  case "contexts": {
                    if (values[name] === "") {
                      return { ...data, [name]: [] };
                    }

                    return {
                      ...data,
                      [name]: values[name].split(",").map((c) => c.trim()),
                    };
                  }
                  default: {
                    return { ...data, [name]: values[name] };
                  }
                }
              }
              return data;
            }, {});

            // NOTE: We need the typeof repeated here so that typescript knows
            // editingTask will not be undefined inside this if block.
            if (typeof editingTask !== "undefined") {
              dispatch(
                updateTask({
                  id: editingTaskId,
                  changes: {
                    contentMarkdown: values.title,
                    data: {
                      // NOTE: We need to copy the existing data as not all the
                      // fields are included in the edit form.
                      ...editingTask.data,
                      ...data,
                    },
                  },
                })
              );
            } else {
              const task: Task = {
                id: createId(),
                contentMarkdown: values.title,
                data,
                finished: false,
                isSequential: false,
                isTask: true,
                parentId: "",
                sectionId: "top",
              };

              dispatch(newTask({ task, insertAtIndex: 0 }));
            }

            dispatch(close());
          }}
        >
          {({ isSubmitting }) => {
            return (
              <div className={classes.wrapper}>
                <Form>
                  <Field
                    component={TextField}
                    type="string"
                    name="title"
                    label="Text"
                    helperText="Supports inline markdown (not inline code blocks)"
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    type="string"
                    name="after"
                    label="After"
                    helperText="YYYY-MM-DD ISO date, or number of days from today (0 today, 1 tomorrow, etc)"
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    type="string"
                    name="by"
                    label="By"
                    helperText="YYYY-MM-DD ISO date, or number of days from today (0 today, 1 tomorrow, etc)"
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    type="string"
                    name="contexts"
                    label="Contexts"
                    helperText="Comma separated lists of contexts, will be whitespace trimmed"
                    fullWidth
                  />
                  <Field
                    component={TextField}
                    type="string"
                    name="repeat"
                    label="Repeat"
                    helperText="3 sections, no spaces. after|every, comma separated numbers, unit (days,weeks,months or day of week or month)"
                    fullWidth
                  />
                  <Typography>
                    <Button
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      onClick={() => dispatch(close())}
                    >
                      Cancel
                    </Button>{" "}
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Typography>
                </Form>
              </div>
            );
          }}
        </Formik>
        {hasRepeat ? (
          <Typography className={classes.close}>
            <Button
              variant="outlined"
              size="small"
              color="default"
              onClick={() => {
                dispatch(closeTaskWithoutRepeating(editingTaskId));
                dispatch(close());
              }}
            >
              <Close /> Close task without repeating
            </Button>
          </Typography>
        ) : null}
      </Paper>
    </Modal>
  );
};

export default TaskForm;

const useStyles = makeStyles((theme) => {
  return {
    root: {
      minWidth: "60vw",
      maxWidth: 400,
      minHeight: "50vh",
      maxHeight: 600,
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      [theme.breakpoints.down("sm")]: {
        top: "53%",
        width: "95vw",
        height: "90vh",
      },
      padding: theme.spacing(2),
      flex: 1,
      overflowY: "scroll",
    },
    wrapper: {
      minWidth: "60%",
    },
    done: { marginTop: theme.spacing(2), textAlign: "center" },
    close: { marginTop: theme.spacing(2), textAlign: "center" },
  };
});
