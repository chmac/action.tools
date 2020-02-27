import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { listItem as defaultListItem } from "react-markdown/lib/renderers";
import Typography from "@material-ui/core/Typography";
import {
  Paper,
  TextField,
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
  const [filteredMarkdown, setFilteredMarkdown] = useState("");
  const [ignoreDates, setIgnoreDates] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const setMarkdownCallback = useCallback(
    async (markdown: string) => {
      // Apply our filters
      const tree = markdownToMdast(markdown);
      const filtered = filterTasks(
        tree,
        filter,
        ignoreDates ? undefined : today(),
        showCompleted
      );
      const filteredMarkdown = await mdastToMarkdown(filtered);
      setFilteredMarkdown(filteredMarkdown);
    },
    [filter, ignoreDates, showCompleted]
  );

  const writeNewMarkdownToStorage = useCallback(
    (markdown: string) => {
      setMarkdown(markdown);
      setFullMarkdown(markdown);
      setMarkdownCallback(markdown);
    },
    [setFullMarkdown, setMarkdownCallback]
  );

  const setCheckedByLineNumber = useCallback(
    (lineNumber: number, checked: boolean) => {
      if (
        !window.confirm(
          `Would you like to mark this task ${
            checked ? "unfinished" : "FINISHED"
          }.`
        )
      ) {
        return;
      }
      const lineIndex = lineNumber - 1;
      const lines = fullMarkdown.split("\n");
      const find = checked ? markdownChecked : markdownUnchecked;
      const replace = checked ? markdownUnchecked : markdownChecked;
      lines[lineIndex] = lines[lineIndex].replace(find, replace);
      const markdown = lines.join("\n");
      writeNewMarkdownToStorage(markdown);
    },
    [fullMarkdown, writeNewMarkdownToStorage]
  );

  useEffect(() => {
    startup().then(() => {
      getMarkdown().then(markdown => {
        setMarkdownCallback(markdown);
        setFullMarkdown(markdown);
      });
    });
  }, [setMarkdownCallback]);

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

  return (
    <div>
      <Typography variant="h1">Do</Typography>
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
      <ReactMarkdown
        source={filteredMarkdown}
        // renderers={{ listItem: ListItem }}
        renderers={renderers}
        rawSourcePos
      />
    </div>
  );
};

export default Do;

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2)
  }
}));
