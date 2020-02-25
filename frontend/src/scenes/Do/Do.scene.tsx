import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { listItem as defaultListItem } from "react-markdown/lib/renderers";
import Typography from "@material-ui/core/Typography";

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
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    fetch("/do.md")
      .then(response => response.text())
      .then(markdown => setMarkdown(markdown));
  }, []);

  const renderers = {
    listItem: (props: any) => {
      if (typeof props.checked === "boolean") {
        const { checked, sourcePosition } = props;
        // debugger;
        return (
          <WrapCheckBox
            markdown={markdown}
            setMarkdown={setMarkdown}
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
      <ReactMarkdown
        source={markdown}
        // renderers={{ listItem: ListItem }}
        renderers={renderers}
        rawSourcePos
      />
    </div>
  );
};

export default Do;
