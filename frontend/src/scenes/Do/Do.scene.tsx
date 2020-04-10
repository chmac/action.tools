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
  InputLabel,
  Modal,
} from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { snackbarService } from "uno-material-ui";
import { repeatTasks, today } from "do.md";

import {
  startup,
  getMarkdown,
  setMarkdown,
  wipe,
} from "../../services/storage/storage.service";
import Markdown from "./components/Markdown.component";
import {
  markdownToMdast,
  mdastToMarkdown,
} from "../../services/mdast/mdast.service";
import { Filter } from "do.md/dist/filter";

const markdownChecked = "- [x]";
const markdownUnchecked = "- [ ]";

const applyMarkdownTransforms = async (input: string): Promise<string> => {
  try {
    const mdast = markdownToMdast(input);
    const repeated = repeatTasks(mdast, today().toString());
    const markdown = await mdastToMarkdown(repeated);
    return markdown;
  } catch (err) {
    snackbarService.showSnackbar(
      `Error in transforming markdown #6V1BOv: ${err.message}`,
      "error"
    );
    throw err;
  }
};

const humanReadableDate = (offset: number): string => {
  if (offset === -1) {
    return "Yesterday";
  }
  if (offset === 0) {
    return "Today";
  }
  if (offset === 1) {
    return "Tomorrow";
  }
  return today().plusDays(offset).toString();
};

const Do = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState("");
  const [fullMarkdown, setFullMarkdown] = useState("");
  const [filterByDate, setFilterByDate] = useState(true);
  const [dateFilterOffsetDays, setDateFilterOffsetDays] = useState(0);
  const [showEverything, setShowEverything] = useState(false);

  useEffect(() => {
    const original = window.onbeforeunload;

    const cleanup = () => {
      window.onbeforeunload = original;
    };

    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };

    return cleanup;
  }, []);

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
      getMarkdown().then((markdown) => {
        setFullMarkdown(markdown);
      });
    });
  }, [setFullMarkdown]);

  const getFilterParams = useCallback((): Filter => {
    if (showEverything) {
      return {};
    }

    if (filterByDate) {
      return {
        exactDate: today().plusDays(dateFilterOffsetDays).toString(),
        showUndated: false,
        text: filter,
      };
    }

    return {
      today: today().toString(),
      text: filter,
    };
  }, [showEverything, filterByDate, dateFilterOffsetDays, filter]);

  return (
    <div className={classes.page}>
      <Paper elevation={1} className={classes.paper}>
        <FormControl>
          <InputLabel htmlFor="filter-text">Filter</InputLabel>
          <Input
            id="filter-text"
            value={filter}
            onChange={(event) => {
              if (showEverything) {
                setShowEverything(false);
              }
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
                checked={filterByDate}
                onChange={() => {
                  if (!filterByDate && showEverything) {
                    setShowEverything(false);
                  }
                  setFilterByDate(!filterByDate);
                }}
                value="Filter by exact date"
              />
            }
            label="Exact date"
          />
          {filterByDate ? (
            <>
              <IconButton
                aria-label="Backwards by a day"
                onClick={() => {
                  setDateFilterOffsetDays(dateFilterOffsetDays - 1);
                }}
              >
                <NavigateBefore />
              </IconButton>
              <Button
                onClick={() => {
                  setDateFilterOffsetDays(0);
                }}
              >
                {humanReadableDate(dateFilterOffsetDays)}
              </Button>
              <IconButton
                aria-label="Forwards by a day"
                onClick={() => {
                  setDateFilterOffsetDays(dateFilterOffsetDays + 1);
                }}
              >
                <NavigateNext />
              </IconButton>
            </>
          ) : null}
        </FormGroup>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={showEverything}
                onChange={() => {
                  if (!showEverything) {
                    setFilterByDate(false);
                    setFilter("");
                  }
                  setShowEverything(!showEverything);
                }}
                value="Show everything"
              />
            }
            label="Show everything"
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
      <Typography component="div" className={classes.markdown}>
        <Markdown
          markdown={fullMarkdown}
          filter={getFilterParams()}
          setCheckedByLineNumber={setCheckedByLineNumber}
        />
      </Typography>
      <Paper className={classes.bottomActions}>
        <Typography variant="h2">Danger</Typography>
        <Button
          size="small"
          onClick={() => {
            if (!window.confirm("Are you sure? There is no undo.")) {
              return;
            }
            if (
              !window.confirm("Are you REALLY sure? There REALLY is no undo.")
            ) {
              return;
            }
            wipe();
          }}
        >
          Reset Everything
        </Button>
      </Paper>
    </div>
  );
};

export default Do;

const useStyles = makeStyles((theme) => ({
  page: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  paper: {
    padding: theme.spacing(2),
  },
  markdown: {
    minHeight: "100vh",
  },
  bottomActions: {
    marginTop: 100,
    padding: theme.spacing(2),
  },
}));
