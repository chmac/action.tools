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
} from "@material-ui/core";
import Clear from "@material-ui/icons/Clear";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { repeatTasks, today } from "do.md-archive";
import { Filter } from "do.md-archive/dist/filter";

import {
  startup,
  getMarkdown,
  setMarkdown,
  wipe,
} from "../../services/storage/storage.service";
import { pushError } from "../../services/notifications/notifications.service";
import Markdown from "./components/Markdown.component";
import {
  markdownToMdast,
  mdastToMarkdown,
} from "../../services/mdast/mdast.service";
import { reset } from "../../services/notifications/notifications.state";

const markdownChecked = "- [x]";
const markdownUnchecked = "- [ ]";

const wrapAndLogError = async (fn: () => any, message: string) => {
  try {
    return await fn();
  } catch (error) {
    pushError({ message, error });
    throw error;
  }
};

const applyMarkdownTransforms = async (input: string): Promise<string> => {
  const mdast = await wrapAndLogError(
    () => markdownToMdast(input),
    "Error caught in markdownToMdast(). #3c8zEp"
  );
  const repeated = await wrapAndLogError(
    () => repeatTasks(mdast, today().toString()),
    "Error caught in repeatTasks(). #aEscN1"
  );
  const markdown = await wrapAndLogError(
    () => mdastToMarkdown(repeated),
    "Error caught in mdastToMarkdown(). #Y854YK"
  );
  return markdown;
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
      try {
        const markdown = await applyMarkdownTransforms(input);
        setMarkdown(markdown);
        setFullMarkdown(markdown);
      } catch (error) {
        // NOTE: We can safely ignore errors here because they have already
        // been logged inside of any of the functions above.
      }
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
    startup()
      .then(() => {
        getMarkdown().then((markdown) => {
          setFullMarkdown(markdown);
        });
      })
      .catch((error) => {
        pushError({ message: "Error during storage startup. #kSCkwY", error });
      });
  }, [setFullMarkdown]);

  const getFilterParams = useCallback((): Filter => {
    if (showEverything) {
      return {};
    }

    const text = filter.toLowerCase();

    if (filterByDate) {
      return {
        exactDate: today().plusDays(dateFilterOffsetDays).toString(),
        showUndated: false,
        text,
      };
    }

    return {
      today: today().toString(),
      text,
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
                className={classes.date}
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
        <Typography>
          Version: {process.env.REACT_APP_VERSION_GIT || "dev"} built at{" "}
          {process.env.REACT_APP_BUILD_TIME || "now"}
        </Typography>
        <Button
          size="small"
          onClick={() => {
            wipe();
          }}
        >
          Wipe Storage
        </Button>
        <Button
          size="small"
          onClick={() => {
            reset();
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
