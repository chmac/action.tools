/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import * as u from "unist-builder";
import { LocalDate } from "@js-joda/core";

import {
  doesTaskMatchFilter,
  isTaskSnoozed,
  isTaskActionableToday,
  doesTaskMatchTodayFilter,
  doesTaskHaveMatchingChildren,
  filterTasks
} from "../filter";

import { makeTask } from "./__fixtures__/tasks.fixtures";
import { yesterday, today, tomorrow } from "./__fixtures__/dates.fixtures";

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

    it("Does not match FOO as a filter #Zs6AQ1", () => {
      const task = makeTask("This is a FOO task");
      expect(doesTaskMatchFilter(task, "FOO")).toEqual(false);
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
      const task = makeTask("A snoozed until yesterday task snooze:2020-02-25");
      expect(isTaskSnoozed(task, today)).toEqual(true);
    });
  });

  describe("isTaskActionableToday()", () => {
    it("Returns true for a task with no after date #TOn1Vq", () => {
      const task = makeTask("An example task");
      expect(isTaskActionableToday(task, today)).toEqual(true);
    });

    it("Returns true for a task with after:yesterday #sunNU9", () => {
      const task = makeTask("An example task after:2020-02-23");
      expect(isTaskActionableToday(task, today)).toEqual(true);
    });

    it("Returns true for a task with after:today #lcAaiu", () => {
      const task = makeTask("An example task after:2020-02-24");
      expect(isTaskActionableToday(task, today)).toEqual(true);
    });

    it("Returns false for a task with after:tomorrow #jAcnoR", () => {
      const task = makeTask("An example task after:2020-02-25");
      expect(isTaskActionableToday(task, today)).toEqual(false);
    });
  });

  describe("doesTaskMatchTodayFilter()", () => {
    it("Returns true for a task with only an after date in the past #3cDKiv", () => {
      const task = makeTask("A task after yesterday after:2020-02-23");
      expect(doesTaskMatchTodayFilter(task, today)).toEqual(true);
    });

    it("Returns true for a task with only an after date in the future #tIHF4S", () => {
      const task = makeTask("A task after tomorrow after:2020-02-25");
      expect(doesTaskMatchTodayFilter(task, today)).toEqual(false);
    });

    it("Returns true for a task with only a snooze date in the past #a5mD3U", () => {
      const task = makeTask("A task snoozed until yesterday snooze:2020-02-23");
      expect(doesTaskMatchTodayFilter(task, today)).toEqual(true);
    });

    it("Returns false for a task with only a snooze date in the future #sxrw7K", () => {
      const task = makeTask("A task after tomorrow after:2020-02-23");
      expect(doesTaskMatchTodayFilter(task, today)).toEqual(true);
    });

    it("Returns false for a task with a snooze date in the future and an after date in the past #w9I4Hr", () => {
      const task = makeTask(
        "A task after yesterday after:2020-02-23 snoozed until tomorrow snooze:2020-02-25"
      );
      expect(doesTaskMatchTodayFilter(task, today)).toEqual(false);
    });

    it("Returns false for a task with a snooze date in the past and an after date in the past #v1lmpS", () => {
      const task = makeTask(
        "A task after the day before yesterday after:2020-02-22 snoozed until yesterday snooze:2020-02-23"
      );
      expect(doesTaskMatchTodayFilter(task, today)).toEqual(true);
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

    it("Returns false for a task with a child list that does not contain tasks #xWWKMo", () => {
      const task = u("listItem", { checked: false, spread: false }, [
        u("paragraph", [
          u("text", { value: "This is a task which does have a child" })
        ]),
        u("list", [
          u("listItem", [
            u("paragraph", [u("text", { value: "This is not a task" })])
          ])
        ])
      ]);
      expect(doesTaskHaveMatchingChildren(task)).toEqual(false);
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

    it("Only removes tasks which match the filter #4nbeX6", () => {
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
