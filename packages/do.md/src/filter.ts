import { Node, Parent } from "unist";
import reduce from "unist-util-reduce";
import { selectAll } from "unist-util-select";

import { isTask, getTitle, hasKeyValue } from "./utils";
import { Task } from "./types";
import { LocalDate } from "@js-joda/core";
import {
  getDateField,
  isTodayOrInTheFuture,
  isTodayOrInThePast
} from "./dates";
import { AFTER, BY, SNOOZE } from "./constants";

export const doesTaskMatchFilter = (task: Task, filterText = ""): boolean => {
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

export const isTaskActionableToday = (
  task: Task,
  today: LocalDate
): boolean => {
  // When a task has no `after:` date, then it's always actioanble
  if (!hasKeyValue(AFTER, task)) {
    return true;
  }
  const after = getDateField(AFTER, task);
  return isTodayOrInThePast(after, today);
};

export const doesTaskMatchTodayFilter = (
  task: Task,
  today: LocalDate
): boolean => {
  if (isTaskSnoozed(task, today) || !isTaskActionableToday(task, today)) {
    return false;
  }
  return true;
};

// The `reduce()` runs depth first, starting from the deepest nodes and working
// upwards. By the time it runs for a parent task, the children will already
// have been removed if they do not match. This means any task which has child
// tasks, must have matching children.
export const doesTaskHaveMatchingChildren = (task: Task): boolean => {
  const childTasks = selectAll(":root > list > listItem", task);
  return Boolean(childTasks.find(isTask));
};

export const filterTasks = (
  root: Parent,
  filterText = "",
  today?: LocalDate
): Parent => {
  if (filterText === "") {
    return root;
  }

  return reduce(root, (task: Node) => {
    if (isTask(task)) {
      if (
        doesTaskMatchFilter(task, filterText) ||
        doesTaskHaveMatchingChildren(task)
      ) {
        return task;
      }

      return [];
    }
    return task;
  });
};
