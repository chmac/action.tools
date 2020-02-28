import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { listItem as defaultListItem } from "react-markdown/lib/renderers";
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
import { today, filterTasks } from "do.md";

import {
  startup,
  getMarkdown,
  setMarkdown
} from "../../services/storage/storage.service";
import {
  markdownToMdast,
  mdastToMarkdown
} from "../../services/mdast/mdast.service";
import Markdown from "./components/Markdown.component";

const markdownChecked = "- [x]";
const markdownUnchecked = "- [ ]";

const WrapCheckBox = (props: any) => {
  const { setCheckedByLineNumber, sourcePosition, checked, children } = props;
  return (
    <div
      onClick={event => {
        // Unless we stop propagation, this event bubbles up to any parent
        // wrapping listItems.
        event.stopPropagation();

        setCheckedByLineNumber(sourcePosition.start.line, checked);
      }}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListItem = (props: {
  checked?: boolean;
  children: any;
  "data-sourcepos"?: any;
}) => {
  const { checked, children } = props;
  const liProps = props["data-sourcepos"]
    ? { "data-sourcepos": props["data-sourcepos"] }
    : {};
  return (
    <li {...liProps}>
      {typeof checked === "boolean" ? (
        <input
          type="checkbox"
          readOnly
          onClick={event => {
            event.stopPropagation();
            console.log(props);
            debugger;
          }}
        />
      ) : null}
      {children}
    </li>
  );
};

const Do = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [fullMarkdown, setFullMarkdown] = useState("");
  const [ignoreDates, setIgnoreDates] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const writeNewMarkdownToStorage = useCallback(
    (markdown: string) => {
      setMarkdown(markdown);
      setFullMarkdown(markdown);
    },
    [setFullMarkdown]
  );

  const setCheckedByLineNumber = useCallback(
    (lineNumber: number, previousCheckedValue: boolean) => {
      debugger;
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

  /*
  const renderers = {
    listItem: (props: any) => {
      if (typeof props.checked === "boolean") {
        const { checked, sourcePosition } = props;
        return (
          <WrapCheckBox
            setCheckedByLineNumber={setCheckedByLineNumber}
            checked={checked}
            sourcePosition={sourcePosition}
          >
            {defaultListItem(props)}
          </WrapCheckBox>
        );
      }
      return defaultListItem(props);
    }
  };
  */

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
        {/* <ReactMarkdown
          source={filteredMarkdown}
          // renderers={{ listItem: ListItem }}
          renderers={renderers}
          rawSourcePos
        /> */}
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
