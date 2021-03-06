// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import * as u from "unist-builder";

import {
  doesTaskMatchFilterText,
  isTaskSnoozed,
  isTaskUndated,
  isTaskActionableByDate,
  doesTaskMatchExactDate,
  doesTaskHaveMatchingChildren,
  filterTasks,
} from "../filter";

import { makeTask } from "./__fixtures__/tasks.fixtures";
import { today } from "./__fixtures__/dates.fixtures";

describe("filter", () => {
  describe("doesTaskMatchFilter()", () => {
    it("Matches foo #HlHWvd", () => {
      const task = makeTask("This is a foo task");
      expect(doesTaskMatchFilterText(task, "foo")).toEqual(true);
    });

    it("Matches FOO #GGCt81", () => {
      const task = makeTask("This is a FOO task");
      expect(doesTaskMatchFilterText(task, "foo")).toEqual(true);
    });

    it("Does not match FOO as a filter #Zs6AQ1", () => {
      const task = makeTask("This is a FOO task");
      expect(doesTaskMatchFilterText(task, "FOO")).toEqual(false);
    });
  });

  describe("isTaskSnoozed()", () => {
    it("Returns true for a false snoozed until yesterday #8wrYPX", () => {
      const task = makeTask("A snoozed until yesterday task snooze:2020-02-23");
      expect(isTaskSnoozed(task, today)).toEqual(false);
    });

    it("Returns false for a task snoozed until today #WlFuI1", () => {
      const task = makeTask("A snoozed until yesterday task snooze:2020-02-24");
      expect(isTaskSnoozed(task, today)).toEqual(false);
    });

    it("Returns true for a task snoozed until tomorrow #hKy1hc", () => {
      const task = makeTask("A snoozed until yesterday task", false, [
        "snooze:2020-02-25",
      ]);
      expect(isTaskSnoozed(task, today)).toEqual(true);
    });
  });

  describe("isTaskUndated()", () => {
    it("Returns true for a task without any key value pairs #vG09hI", () => {
      const task = makeTask("An example task without any dates");
      expect(isTaskUndated(task)).toEqual(true);
    });

    it("Returns false for a task with a by date #MvFWSL", () => {
      const task = makeTask("An example task with a by date of today", false, [
        "by:2020-02-24",
      ]);
      expect(isTaskUndated(task)).toEqual(false);
    });

    it("Returns false for a task with an after date #26LP05", () => {
      const task = makeTask(
        "An example task with an after date of today",
        false,
        ["after:2020-02-24"]
      );
      expect(isTaskUndated(task)).toEqual(false);
    });

    it("Returns false for a task with both a by and after date #VRvC4t", () => {
      const task = makeTask(
        "An example task with an after date of yesterday and a by date of today",
        false,
        ["after:2020-02-23", "by:2020-02-24"]
      );
      expect(isTaskUndated(task)).toEqual(false);
    });

    it("Returns false for a task which has a snooze date #N0TvuO", () => {
      const task = makeTask("An action with a snooze date of tomorrow", false, [
        "snooze:2020-02-25"
      ]);
      expect(isTaskUndated(task)).toEqual(false);
    });
  });

  describe("isTaskActionableByDate()", () => {
    it("Returns true for a task with no after date #TOn1Vq", () => {
      const task = makeTask("An example task");
      expect(isTaskActionableByDate(task, today)).toEqual(true);
    });

    it("Returns true for a task with after:yesterday #sunNU9", () => {
      const task = makeTask("An example task", false, ["after:2020-02-23"]);
      expect(isTaskActionableByDate(task, today)).toEqual(true);
    });

    it("Returns true for a task with after:today #lcAaiu", () => {
      const task = makeTask("An example task", false, ["after:2020-02-24"]);
      expect(isTaskActionableByDate(task, today)).toEqual(true);
    });

    it("Returns false for a task with after:tomorrow #jAcnoR", () => {
      const task = makeTask("An example task", false, ["after:2020-02-25"]);
      expect(isTaskActionableByDate(task, today)).toEqual(false);
    });
  });

  describe("doesTaskMatchExactDate()", () => {
    it("Returns false when task is snoozed #Kn9nzp", () => {
      const task = makeTask("A task snoozed until tomorrow", false, [
        "snooze:2020-02-25",
      ]);
      expect(doesTaskMatchExactDate(task, today)).toEqual(false);
    });

    it("Returns true when task is by today #cqE1DM", () => {
      const task = makeTask("A task after today", false, ["by:2020-02-24"]);
      expect(doesTaskMatchExactDate(task, today)).toEqual(true);
    });

    it("Returns true when the task is after today #dXz77J", () => {
      const task = makeTask("A task after today", false, ["after:2020-02-24"]);
      expect(doesTaskMatchExactDate(task, today)).toEqual(true);
    });

    it("Returns true when task is after yesterday and by today #VrH0UL", () => {
      const task = makeTask("A task after today", false, [
        "after:2020-02-23",
        "by:2020-02-24",
      ]);
      expect(doesTaskMatchExactDate(task, today)).toEqual(true);
    });

    it("Returns true when task is after today and by tomorrow #7WKTmb", () => {
      const task = makeTask("A task after today", false, [
        "after:2020-02-24",
        "by:2020-02-25",
      ]);
      expect(doesTaskMatchExactDate(task, today)).toEqual(true);
    });
  });

  describe("doesTaskHaveMatchingChildren()", () => {
    it("Returns false for a task which only has non-task children #z2rCt5", () => {
      const task = makeTask("This is a task without any children");
      expect(doesTaskHaveMatchingChildren(task)).toEqual(false);
    });

    it("Returns true for a task with a child #Ee2hBO", () => {
      const task = u("listItem", { checked: false, spread: false }, [
        u("paragraph", [
          u("text", { value: "This is a task which does have a child" }),
        ]),
        u("list", [makeTask("This is a child task")]),
      ]);
      expect(doesTaskHaveMatchingChildren(task)).toEqual(true);
    });

    it("Returns false for a task with a child list that does not contain tasks #xWWKMo", () => {
      const task = u("listItem", { checked: false, spread: false }, [
        u("paragraph", [
          u("text", { value: "This is a task which does have a child" }),
        ]),
        u("list", [
          u("listItem", [
            u("paragraph", [u("text", { value: "This is not a task" })]),
          ]),
        ]),
      ]);
      expect(doesTaskHaveMatchingChildren(task)).toEqual(false);
    });

    it("Returns true for a task with a grand child task #NF0w9O", () => {
      const task = u("listItem", { checked: false, spread: false }, [
        u("paragraph", [
          u("text", { value: "This is a task which does have a child" }),
        ]),
        u("list", [
          u("listItem", [
            u("paragraph", [u("text", { value: "This is not a task" })]),
            u("list", [makeTask("This is a grandchild task")]),
          ]),
        ]),
      ]);
      expect(doesTaskHaveMatchingChildren(task)).toEqual(true);
    });
  });

  describe("filterTasks()", () => {
    it("Returns all tasks with an empty filter #P9yztO", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar"),
        ]),
      ]);

      expect(filterTasks(tasks, {})).toEqual(tasks);
    });

    it("Applies date filter even when text filter is empty #suIvp5", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task after tomorrow", false, ["after:2020-02-25"]),
          makeTask("A task with foo and bar"),
        ]),
      ]);
      const expected = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar"),
        ]),
      ]);

      expect(filterTasks(tasks, { today: today.toString() })).toEqual(expected);
    });

    it("Returns all tasks when they all match the filter #epsQL2", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar"),
        ]),
      ]);

      expect(filterTasks(tasks, { text: "foo" })).toEqual(tasks);
    });

    it("Only removes tasks which match the filter #4nbeX6", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar and baz"),
          makeTask("A task with foo and bar"),
        ]),
      ]);
      const expected = u("root", [
        u("list", [makeTask("A task with foo and bar and baz")]),
      ]);

      expect(filterTasks(tasks, { text: "baz" })).toEqual(expected);
    });

    it("Returns parent tasks if the children match #cP5iEM", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          u("listItem", { checked: false, spread: false }, [
            u("list", [makeTask("A task with foo and bar and baz")]),
          ]),
          makeTask("A task with foo and bar"),
        ]),
      ]);
      const expected = u("root", [
        u("list", [
          u("listItem", { checked: false, spread: false }, [
            u("list", [makeTask("A task with foo and bar and baz")]),
          ]),
        ]),
      ]);

      expect(filterTasks(tasks, { text: "baz" })).toEqual(expected);
    });

    it("Hides completed tasks if showCompleted is false #2dL4GP", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          u("listItem", { checked: false, spread: false }, [
            u("list", [
              makeTask("A task with foo and bar and baz"),
              makeTask("A finished task", true),
              makeTask("A COMPLETED task to be hidden", true),
            ]),
          ]),
          makeTask("A task with foo and bar"),
        ]),
      ]);
      const expected = u("root", [
        u("list", [
          u("listItem", { checked: false, spread: false }, [
            u("list", [makeTask("A task with foo and bar and baz")]),
          ]),
        ]),
      ]);

      expect(
        filterTasks(tasks, {
          text: "baz",
          showUndated: true,
          showCompleted: false,
        })
      ).toEqual(expected);
    });

    it("Shows completed tasks if showCompleted is true #Vj0f2b", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          u("listItem", { checked: false, spread: false }, [
            u("list", [
              makeTask("A task with foo and bar and baz"),
              makeTask("A finished task with foo and bar and baz", true),
              makeTask(
                "A COMPLETED task to be hidden also with foo bar and baz",
                true
              ),
            ]),
          ]),
          makeTask("A task with foo and bar"),
        ]),
      ]);
      const expected = u("root", [
        u("list", [
          u("listItem", { checked: false, spread: false }, [
            u("list", [
              makeTask("A task with foo and bar and baz"),
              makeTask("A finished task with foo and bar and baz", true),
              makeTask(
                "A COMPLETED task to be hidden also with foo bar and baz",
                true
              ),
            ]),
          ]),
        ]),
      ]);

      expect(
        filterTasks(tasks, {
          text: "baz",
          showUndated: true,
          showCompleted: true,
        })
      ).toEqual(expected);
    });

    it("Does not show completed tasks when ignoring dates #XHI21O", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("An example task"),
          makeTask("An example with a future after date", false, [
            "after:2020-02-28",
          ]),
          makeTask("A completed task", true),
        ]),
      ]);
      const expected = u("root", [
        u("list", [
          makeTask("An example task"),
          makeTask("An example with a future after date", false, [
            "after:2020-02-28",
          ]),
        ]),
      ]);

      expect(
        filterTasks(tasks, { showUndated: true, showCompleted: false })
      ).toEqual(expected);
    });
  });
});
