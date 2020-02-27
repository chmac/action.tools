/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import * as u from "unist-builder";

import {
  doesTaskMatchFilter,
  doesTaskHaveMatchingChildren,
  filterTasks
} from "../filter";
import { makeTask } from "./__fixtures__/tasks.fixtures";

describe("filter", () => {
  describe("doesTaskMatchFilter()", () => {
    it("Matches foo #HlHWvd", () => {
      const task = makeTask("This is a foo task");
      expect(doesTaskMatchFilter(task, "foo")).toEqual(true);
    });

    it("Matches FOO #GGCt81", () => {
      const task = makeTask("This is a FOO task");
      expect(doesTaskMatchFilter(task, "foo")).toEqual(true);
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
          u("text", { value: "This is a task which does have a child" })
        ]),
        u("list", [makeTask("This is a child task")])
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
          makeTask("A task with foo and bar")
        ])
      ]);

      expect(filterTasks(tasks, "")).toEqual(tasks);
    });

    it("Returns all tasks when they all match the filter #epsQL2", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar")
        ])
      ]);

      expect(filterTasks(tasks, "foo")).toEqual(tasks);
    });

    it("Only removes tasks which  match the filter #4nbeX6", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          makeTask("A task with foo and bar and baz"),
          makeTask("A task with foo and bar")
        ])
      ]);
      const expected = u("root", [
        u("list", [makeTask("A task with foo and bar and baz")])
      ]);

      expect(filterTasks(tasks, "baz")).toEqual(expected);
    });

    it("Returns parent tasks if the children match #cP5iEM", () => {
      const tasks = u("root", [
        u("list", [
          makeTask("A task with foo and bar"),
          u("listItem", { checked: false, spread: false }, [
            u("list", [makeTask("A task with foo and bar and baz")])
          ]),
          makeTask("A task with foo and bar")
        ])
      ]);
      const expected = u("root", [
        u("list", [
          u("listItem", { checked: false, spread: false }, [
            u("list", [makeTask("A task with foo and bar and baz")])
          ])
        ])
      ]);

      expect(filterTasks(tasks, "baz")).toEqual(expected);
    });
  });
});
