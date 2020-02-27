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
  Switch
} from "@material-ui/core";
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
  const { markdown, setMarkdown, sourcePosition, checked, children } = props;
  return (
    <div
      onClick={event => {
        // Unless we stop propagation, this event bubbles up to any parent
        // wrapping listItems.
        event.stopPropagation();

        const lineIndex = sourcePosition.start.line - 1;
        const lines = markdown.split("\n");
        const find = checked ? markdownChecked : markdownUnchecked;
        const replace = checked ? markdownUnchecked : markdownChecked;
        lines[lineIndex] = lines[lineIndex].replace(find, replace);
        setMarkdown(lines.join("\n"));
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
  const [filteredMarkdown, setFilteredMarkdown] = useState("");
  const [ignoreDates, setIgnoreDates] = useState(false);

  const setMarkdownCallback = useCallback(
    async (markdown: string) => {
      // Apply our filters
      const tree = markdownToMdast(markdown);
      const filtered = filterTasks(
        tree,
        filter,
        ignoreDates ? undefined : today()
      );
      const filteredMarkdown = await mdastToMarkdown(filtered);
      setFilteredMarkdown(filteredMarkdown);
    },
    [filter, ignoreDates]
  );

  const writeNewMarkdownToStorage = (markdown: string) => {
    setMarkdown(markdown);
    setMarkdownCallback(markdown);
  };

  useEffect(() => {
    startup().then(() => {
      getMarkdown().then(markdown => setMarkdownCallback(markdown));
    });
  }, [setMarkdownCallback]);

  const renderers = {
    listItem: (props: any) => {
      if (typeof props.checked === "boolean") {
        const { checked, sourcePosition } = props;
        // debugger;
        return (
          <WrapCheckBox
            markdown={filteredMarkdown}
            setMarkdown={writeNewMarkdownToStorage}
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
        <TextField
          label="Filter"
          onChange={event => {
            setFilter(event.target.value);
          }}
        />
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
        </FormGroup>
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
