// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>

import * as u from "unist-builder";

import { countTasks, countLeafTasks } from "../count";
import { makeTask } from "./__fixtures__/tasks.fixtures";

describe("count", () => {
  describe("countTasks()", () => {
    it("Counts top level tasks accurately #38yazm", () => {
      const tasks = u("root", [
        makeTask("An example task"),
        makeTask("Another example task"),
        makeTask("A third example task")
      ]);
      expect(countTasks(tasks)).toEqual(3);
    });

    it("Counts only nested tasks accurately #38yazm", () => {
      const tasks = u("root", [
        makeTask("An example task"),
        makeTask("Another example task"),
        makeTask("A third example task"),
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [u("text", { value: "A fourth top level task" })]),
          u("list", [
            makeTask("A child task"),
            makeTask("A second child task"),
            makeTask("A third child task")
          ])
        ])
      ]);
      expect(countTasks(tasks)).toEqual(7);
    });
  });

  describe("countLeafTasks()", () => {
    it("Counts top level tasks accurately #2zdR0T", () => {
      const tasks = u("root", [
        makeTask("An example task"),
        makeTask("Another example task"),
        makeTask("A third example task")
      ]);
      expect(countLeafTasks(tasks)).toEqual(3);
    });

    it("Counts only leaf tasks accurately #oFjAYV", () => {
      const tasks = u("root", [
        makeTask("An example task"),
        makeTask("Another example task"),
        makeTask("A third example task"),
        u("listItem", { checked: false, spread: false }, [
          u("paragraph", [u("text", { value: "A fourth top level task" })]),
          u("list", [
            makeTask("A child task"),
            makeTask("A second child task"),
            makeTask("A third child task")
          ])
        ])
      ]);
      expect(countLeafTasks(tasks)).toEqual(6);
    });
  });
});
