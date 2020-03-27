import React, { useState, useEffect, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import {
  Paper,
  makeStyles,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  Input,
  InputLabel
} from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";

import {
  startup,
  getMarkdown,
  setMarkdown
} from "../../services/storage/storage.service";
import Markdown from "./components/Markdown.component";
import {
  markdownToMdast,
  mdastToMarkdown
} from "../../services/mdast/mdast.service";
import { repeatTasks, today } from "do.md";

const markdownChecked = "- [x]";
const markdownUnchecked = "- [ ]";

const applyMarkdownTransforms = async (input: string): Promise<string> => {
  const mdast = markdownToMdast(input);
  const repeated = repeatTasks(mdast, today().toString());
  const markdown = await mdastToMarkdown(repeated);
  return markdown;
};

const Do = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [fullMarkdown, setFullMarkdown] = useState("");
  const [ignoreDates, setIgnoreDates] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const writeNewMarkdownToStorage = useCallback(
    async (input: string) => {
      const markdown = await applyMarkdownTransforms(input);
      setMarkdown(markdown);
      setFullMarkdown(markdown);
    },
    [setFullMarkdown]
  );

  const setCheckedByLineNumber = useCallback(
    (lineNumber: number, previousCheckedValue: boolean) => {
      const lineIndex = lineNumber - 1;
      const lines = fullMarkdown.split("\n");
      const find = previousCheckedValue ? markdownChecked : markdownUnchecked;
      const replace = previousCheckedValue
        ? markdownUnchecked
        : markdownChecked;
      const line = lines[lineIndex];
      if (
        !window.confirm(
          `Would you like to mark this task ${
            previousCheckedValue ? "unfinished" : "FINISHED"
          }:\n${line}`
        )
      ) {
        return;
      }
      lines[lineIndex] = line.replace(find, replace);
      const markdown = lines.join("\n");
      writeNewMarkdownToStorage(markdown);
    },
    [fullMarkdown, writeNewMarkdownToStorage]
  );

  useEffect(() => {
    startup().then(() => {
      getMarkdown().then(markdown => {
        setFullMarkdown(markdown);
      });
    });
  }, [setFullMarkdown]);

  return (
    <div className={classes.page}>
      <Paper elevation={1} className={classes.paper}>
        <Typography>Enter a filter here:</Typography>
        <FormControl>
          <InputLabel htmlFor="filter-text">Filter</InputLabel>
          <Input
            id="filter-text"
            value={filter}
            onChange={event => {
              setFilter(event.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear filter"
                  onClick={() => {
                    setFilter("");
                  }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            }
          ></Input>
        </FormControl>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={ignoreDates}
                onChange={() => {
                  setIgnoreDates(!ignoreDates);
                }}
                value="Ignore dates"
              />
            }
            label="Ignore dates"
          />
        </FormGroup>{" "}
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={showCompleted}
                onChange={() => {
                  setShowCompleted(!showCompleted);
                }}
                value="Show completed"
              />
            }
            label="Show completed"
          />
        </FormGroup>
        <Button
          variant="contained"
          onClick={() => {
            const newTask = window.prompt("Enter the next task") || "";
            if (newTask.length === 0) {
              return;
            }
            writeNewMarkdownToStorage(`- [ ] ${newTask}\n${fullMarkdown}`);
          }}
        >
          Create new task
        </Button>
      </Paper>
      <Typography component="div">
        <Markdown
          markdown={fullMarkdown}
          showCompleted={showCompleted}
          ignoreDates={ignoreDates}
          filterText={filter}
          setCheckedByLineNumber={setCheckedByLineNumber}
        />
      </Typography>
    </div>
  );
};

export default Do;

const useStyles = makeStyles(theme => ({
  page: {
    paddingTop: 20
  },
  paper: {
    padding: theme.spacing(2)
  }
}));
