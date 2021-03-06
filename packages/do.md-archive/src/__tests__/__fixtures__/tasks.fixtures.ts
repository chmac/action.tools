import * as u from "unist-builder";
import { Task } from "../../types";

export const makeTask = (
  title: string,
  completed = false,
  fields?: string[]
): Task => {
  return u("listItem", { checked: completed, spread: false }, [
    u("paragraph", [
      u("text", {
        value: title,
      }),
      ...(fields || []).map((field) => {
        return u("inlineCode", { value: field });
      }),
    ]),
  ]);
};

export const task = u("listItem", { checked: false, spread: false }, [
  u("paragraph", [
    u("text", {
      value:
        "This is an example text #FKG296 with a @context and a second #tag",
    }),
  ]),
]);

export const listItemWithNullChecked = u(
  "listItem",
  { checked: null, spread: false },
  [
    u("paragraph", [
      u("text", {
        value:
          "This is an example text #FKG296 with a @context and a second #tag",
      }),
    ]),
  ]
);

export const listItemWithoutChecked = u("listItem", { spread: false }, [
  u("paragraph", [
    u("text", {
      value:
        "This is an example text #FKG296 with a @context and a second #tag",
    }),
  ]),
]);

export const taskWithKeys = u("listItem", { checked: false, spread: false }, [
  u("paragraph", [
    u("text", {
      value:
        "This is an example text #FKG296 with a @context and a second " +
        "#tag with a created:2020-02-15 date and a finished:2020-02-17 date",
    }),
  ]),
]);

export const tree = u("root", [
  u("list", { ordered: false, spread: false, start: null }, [
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is a task which is unchecked #Gf6a8R" }),
      ]),
    ]),
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is another task also unchecked #IcL6qn" }),
      ]),
    ]),
    u("listItem", { checked: null, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is another task also unchecked #IcL6qn" }),
      ]),
    ]),
  ]),
  u("heading", { depth: 1 }, [u("text", { value: "First Heading" })]),
  u("heading", { depth: 2 }, [u("text", { value: "Second Level 2 Heading" })]),
  u("paragraph", [
    u("text", {
      value: "This is a paragraph which contains a whole chunk of text",
    }),
  ]),
  u("paragraph", [
    u("text", {
      value: "Followed by a paragraph of text",
    }),
  ]),
  u("list", { ordered: false, spread: false, start: null }, [
    // Top level task
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is a top level task #xAgxB9" }),
      ]),
      // Nested list
      u("list", { ordered: false, spread: false, start: null }, [
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [
            u("text", { value: "This is a child task #JkmkMh" }),
          ]),
        ]),
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [u("text", { value: "Second child task #PWfUG1" })]),
        ]),
        u("listItem", { checked: null, spread: false }, [
          u("paragraph", [
            u("text", { value: "Third child level task #eHaqOJ" }),
          ]),
        ]),
      ]),
    ]),
    u("listItem", { checked: true, spread: false }, [
      u("paragraph", [
        u("text", { value: "Back to a top level completed task #FVK0TU" }),
      ]),
    ]),
    u("listItem", { checked: null, spread: false }, [
      u("paragraph", [u("text", { value: "Final top level task #lJNUwz" })]),
    ]),
  ]),
]);

// A tree of tasks including some headings which can be hidden because they
// contain no tasks
export const treeWithEmptyHeadings = u("root", [
  u("list", { ordered: false, spread: false, start: null }, [
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is a task which is unchecked #Gf6a8R" }),
      ]),
    ]),
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is another task also unchecked #IcL6qn" }),
      ]),
    ]),
    u("listItem", { checked: null, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is another task also unchecked #IcL6qn" }),
      ]),
    ]),
  ]),
  u("heading", { depth: 1 }, [u("text", { value: "First Heading" })]),
  u("heading", { depth: 2 }, [u("text", { value: "Second Level 2 Heading" })]),
  u("paragraph", [
    u("text", {
      value: "This is a paragraph which contains a whole chunk of text",
    }),
  ]),
  u("paragraph", [
    u("text", {
      value: "Followed by a paragraph of text",
    }),
  ]),
  u("list", { ordered: false, spread: false, start: null }, [
    // Top level task
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is a top level task #xAgxB9" }),
      ]),
      // Nested list
      u("list", { ordered: false, spread: false, start: null }, [
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [
            u("text", { value: "This is a child task #JkmkMh" }),
          ]),
        ]),
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [u("text", { value: "Second child task #PWfUG1" })]),
        ]),
        u("listItem", { checked: null, spread: false }, [
          u("paragraph", [
            u("text", { value: "Third child level task #eHaqOJ" }),
          ]),
        ]),
      ]),
    ]),
    u("listItem", { checked: true, spread: false }, [
      u("paragraph", [
        u("text", { value: "Back to a top level completed task #FVK0TU" }),
      ]),
    ]),
    u("listItem", { checked: null, spread: false }, [
      u("paragraph", [u("text", { value: "Final top level task #lJNUwz" })]),
    ]),
  ]),
  u("heading", { depth: 1 }, [u("text", { value: "Empty Top Heading" })]),
  u("heading", { depth: 2 }, [u("text", { value: "Empty sub h2" })]),
  u("paragraph", [
    u("text", {
      value: "This is a paragraph without any task children.",
    }),
  ]),
]);

export const treeWithEmptyHeadingsTrimmed = u("root", [
  u("list", { ordered: false, spread: false, start: null }, [
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is a task which is unchecked #Gf6a8R" }),
      ]),
    ]),
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is another task also unchecked #IcL6qn" }),
      ]),
    ]),
    u("listItem", { checked: null, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is another task also unchecked #IcL6qn" }),
      ]),
    ]),
  ]),
  u("heading", { depth: 1 }, [u("text", { value: "First Heading" })]),
  u("heading", { depth: 2 }, [u("text", { value: "Second Level 2 Heading" })]),
  u("paragraph", [
    u("text", {
      value: "This is a paragraph which contains a whole chunk of text",
    }),
  ]),
  u("paragraph", [
    u("text", {
      value: "Followed by a paragraph of text",
    }),
  ]),
  u("list", { ordered: false, spread: false, start: null }, [
    // Top level task
    u("listItem", { checked: false, spread: false }, [
      u("paragraph", [
        u("text", { value: "This is a top level task #xAgxB9" }),
      ]),
      // Nested list
      u("list", { ordered: false, spread: false, start: null }, [
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [
            u("text", { value: "This is a child task #JkmkMh" }),
          ]),
        ]),
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [u("text", { value: "Second child task #PWfUG1" })]),
        ]),
        u("listItem", { checked: null, spread: false }, [
          u("paragraph", [
            u("text", { value: "Third child level task #eHaqOJ" }),
          ]),
        ]),
      ]),
    ]),
    u("listItem", { checked: true, spread: false }, [
      u("paragraph", [
        u("text", { value: "Back to a top level completed task #FVK0TU" }),
      ]),
    ]),
    u("listItem", { checked: null, spread: false }, [
      u("paragraph", [u("text", { value: "Final top level task #lJNUwz" })]),
    ]),
  ]),
]);
