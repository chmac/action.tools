import * as R from "remeda";
import { Node, Parent } from "unist";
import reduce from "unist-util-reduce";
import { selectAll } from "unist-util-select";

import { isTask, getTitle, hasKeyValue } from "./utils";
import { Task } from "./types";
import { LocalDate } from "@js-joda/core";
import { getDateField, isTodayOrInThePast } from "./dates";
import { AFTER, SNOOZE, BY } from "./constants";

export const doesTaskMatchFilterText = (
  task: Task,
  filterText = ""
): boolean => {
  // Always return true for an empty filter
  if (filterText.length === 0) {
    return true;
  }
  const title = getTitle(task);
  return title.toLowerCase().indexOf(filterText) !== -1;
};

export const isTaskSnoozed = (task: Task, today: LocalDate): boolean => {
  // When a task has no `snooze:` date, then it's not snoozed
  if (!hasKeyValue(SNOOZE, task)) {
    return false;
  }
  const snooze = getDateField(SNOOZE, task);
  return snooze.isAfter(today);
};

export const isTaskUndated = (task: Task): boolean => {
  if (hasKeyValue(BY, task) || hasKeyValue(AFTER, task)) {
    return false;
  }
  return true;
};

export const isTaskActionableByDate = (
  task: Task,
  target: LocalDate
): boolean => {
  // When a task has no `after:` date, then it's always actioanble
  if (!hasKeyValue(AFTER, task)) {
    return true;
  }
  const after = getDateField(AFTER, task);
  return isTodayOrInThePast(after, target);
};

export const doesTaskMatchExactDate = (
  task: Task,
  target: LocalDate
): boolean => {
  const hasAfter = hasKeyValue(AFTER, task);
  const hasBy = hasKeyValue(BY, task);

  // if (!hasAfter && !hasBy && !hasSnooze) {
  //   return false
  // }

  if (isTaskSnoozed(task, target)) {
    return false;
  }

  if (hasBy) {
    const by = getDateField(BY, task);
    return by.isEqual(target);
  }

  if (hasAfter) {
    const after = getDateField(AFTER, task);
    return after.isEqual(target);
  }

  return false;
};

// The `reduce()` runs depth first, starting from the deepest nodes and working
// upwards. By the time it runs for a parent task, the children will already
// have been removed if they do not match. This means any task which has child
// tasks, must have matching children.
export const doesTaskHaveMatchingChildren = (task: Task): boolean => {
  const childTasks = selectAll(":root > list listItem", task);
  return Boolean(childTasks.find(isTask));
};

export type Filter = {
  text?: string;
  exactDate?: string;
  today?: string;
  showUndated?: boolean;
  showCompleted?: boolean;
};

export const filterTasks = (root: Parent, filter: Filter): Parent => {
  const defaults = {
    text: "",
    exactDate: "",
    today: "",
    showUndated: true,
    showCompleted: false
  };
  const empty = {
    ...defaults,
    showCompleted: true
  };
  const actual = { ...defaults, ...filter };
  const { text, exactDate, today, showUndated, showCompleted } = actual;

  // If we have no filters applied, then we return everything immediately
  if (
    Object.values(filter).every(val => typeof val === "undefined") ||
    R.equals(actual, empty)
  ) {
    return root;
  }

  const isFilterForExactDate = exactDate !== "";
  const isFilterForToday = !isFilterForExactDate && today !== "";

  return reduce(root, (task: Node) => {
    if (isTask(task)) {
      // If this task has matching children, then we always consider it to be a
      // match, otherwise by removing this node we will also remove the
      // children.
      if (doesTaskHaveMatchingChildren(task)) {
        return task;
      }

      // If we are NOT showing completed tasks AND this task is "checked", then
      // this task should be hidden
      if (!showCompleted && task.checked) {
        return [];
      }

      // If the task fails the text filter, then skip it
      if (!doesTaskMatchFilterText(task, text)) {
        return [];
      }

      // If this task is undated and we are showing undated tasks
      if (isTaskUndated(task)) {
        return showUndated ? task : [];
      }

      if (isFilterForExactDate) {
        const exactDateLocalDate = LocalDate.parse(exactDate);

        // Ignore all tasks which are snoozed
        if (isTaskSnoozed(task, exactDateLocalDate)) {
          return [];
        }

        if (doesTaskMatchExactDate(task, exactDateLocalDate)) {
          return task;
        }

        return [];
      }

      if (isFilterForToday) {
        const todayLocalDate = LocalDate.parse(today);

        // Ignore all tasks which are snoozed
        if (isTaskSnoozed(task, todayLocalDate)) {
          return [];
        }

        if (isTaskActionableByDate(task, todayLocalDate)) {
          return task;
        }

        return [];
      }

      // If no other filters have executed by this point, return the task
      return task;
    }
    return task;
  });
};
