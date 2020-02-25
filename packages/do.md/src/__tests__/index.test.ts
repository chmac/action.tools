/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import * as u from "unist-builder";

import { filterTasks } from "../";
import { makeTask } from "./__fixtures__/tasks.fixtures";

describe("index", () => {
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
