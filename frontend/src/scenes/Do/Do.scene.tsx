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
      onClick={() => {
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
      <ReactMarkdown source={markdown} renderers={renderers} rawSourcePos />
    </div>
  );
};

export default Do;
