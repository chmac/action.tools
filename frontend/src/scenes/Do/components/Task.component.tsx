import React from "react";
import orange from "@material-ui/core/colors/orange";
import { Position } from "unist";

export type SetCheckedByLineNumber = (
  lineNumber: number,
  currentCheckedValue: boolean
) => void;

const titleToBackgroundColor = (title: string): string => {
  if (title.indexOf("p1") !== -1) {
    return orange[900];
  }
  if (title.indexOf("p2") !== -1) {
    return orange[600];
  }
  if (title.indexOf("p3") !== -1) {
    return orange[300];
  }
  return "";
};

const TaskFactory = (setCheckedByLineNumber: SetCheckedByLineNumber) => {
  const Li = (props: {
    position: Position;
    children: Element[];
    checked: boolean;
  }) => {
    const { position, checked, children, ...rest } = props;

    /*
    // Add a deadline to the task description
    const [el, space, title, ...otherChildren] = children;

    // NOTE: This breaks the onClick functionality below...
    // if (
    //   !((title as unknown) as string).match(new RegExp(`${BY}${REGEX_SUFFIX}`))
    // ) {
    //   return <li {...rest}>{children}</li>;
    // }

    const message = <span key="warning">WARNING</span>;

    const newChildren = [el, space, message, " ", title, ...otherChildren];

    // const newChildren = children.reduce<any>((acc, child) => {
    //   if (typeof child === "string") {
    //     debugger;
    //   }
    //   return acc.concat(child);
    // }, []);

    */
    const [, , title] = children;

    return (
      <li
        {...rest}
        onClick={event => {
          // Descendant (child / grandchild / etc) tasks are nested inside other
          // tasks, so we need to stop the event propagating up the tree,
          // otherwise we end up with a click event on each of the ancestors of
          // the task which was clicked.
          event.stopPropagation();
          setCheckedByLineNumber(position.start.line, checked);
        }}
        style={{
          opacity: checked ? 0.5 : 1,
          backgroundColor: titleToBackgroundColor((title as unknown) as string)
        }}
      >
        {children}
        {/* {newChildren} */}
      </li>
    );
  };
  return Li;
};

export default TaskFactory;