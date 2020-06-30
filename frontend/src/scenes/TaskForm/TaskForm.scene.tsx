import {
  Button,
  makeStyles,
  Modal,
  Paper,
  Typography,
} from "@material-ui/core";
import dayjs from "dayjs";
import { createId, newTask, stringifyDayjs, Task, TaskData } from "do.md";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { AppDispatch, AppState } from "../../store";
import { close } from "./TaskForm.state";

// Accept a number or a valid date
const isValidDate = (date: string) => {
  const asInt = parseInt(date);
  if (asInt > -1) {
    return true;
  }
  return dayjs(date).isValid();
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
      return typeof s === "undefined" || s.length === 0;
    }),
});

const TaskForm = () => {
  const classes = useStyles();
  const isOpen = useSelector((state: AppState) => state.TaskForm.isOpen);
  const dispatch: AppDispatch = useDispatch();

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        dispatch(close());
      }}
    >
      <Paper className={classes.root}>
        <Typography variant="h1">Create a task</Typography>
        <Formik
          // NOTE: This must match schema, a value for every field, or the
          // onSubmit() hook will never be called and silently fail.
          initialValues={{
            title: "",
            after: "",
            by: "",
            snooze: "",
            contexts: "",
            repeat: "",
          }}
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
                switch (name) {
                  case "after":
                  case "by": {
                    const asInt = parseInt(values[name]);
                    if (asInt > -1) {
                      return {
                        ...data,
                        [name]: stringifyDayjs(dayjs().add(asInt, "day")),
                      };
                    }
                    return { ...data, [name]: values[name] };
                  }
                  case "contexts": {
                    return {
                      ...data,
                      [name]: values[name].split(",").map((c) => c.trim()),
                    };
                  }
                }
              }
              return data;
            }, {});

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

            helpers.resetForm();
            debugger;
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
  };
});
