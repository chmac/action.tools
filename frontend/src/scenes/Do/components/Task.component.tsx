import React from "react";
import { Position } from "unist";

export type SetCheckedByLineNumber = (
  lineNumber: number,
  currentCheckedValue: boolean
) => void;

const LiFactory = (setCheckedByLineNumber: SetCheckedByLineNumber) => {
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

    return (
      <li
        {...rest}
        onClick={event => {
          debugger;
          // Descendant (child / grandchild / etc) tasks are nested inside other
          // tasks, so we need to stop the event propagating up the tree,
          // otherwise we end up with a click event on each of the ancestors of
          // the task which was clicked.
          event.stopPropagation();
          setCheckedByLineNumber(position.start.line, checked);
        }}
      >
        {children}
        {/* {newChildren} */}
      </li>
    );
  };
  return Li;
};

export default LiFactory;
