import { Node, Parent } from "unist";
import reduce from "unist-util-reduce";
import { selectAll } from "unist-util-select";

import { isTask, getTitle, hasKeyValue } from "./utils";
import { Task } from "./types";
import { LocalDate } from "@js-joda/core";
import { getDateField, isTodayOrInThePast } from "./dates";
import { AFTER, SNOOZE } from "./constants";

export const doesTaskMatchFilter = (task: Task, filterText = ""): boolean => {
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
  today?: LocalDate
): boolean => {
  // If we don't have a date to match against, then all tasks match
  if (typeof today === "undefined") {
    return true;
  }
  try {
    if (isTaskSnoozed(task, today) || !isTaskActionableToday(task, today)) {
      return false;
    }
  } catch (error) {
    // If the tests threw, then we say the task DID match. This ensures that
    // whatever we cannot parse gets displayed to the user. Better to err on the
    // side of over sharing rather than hiding potentially relevant tasks.
    return true;
  }
  return true;
};

// The `reduce()` runs depth first, starting from the deepest nodes and working
// upwards. By the time it runs for a parent task, the children will already
// have been removed if they do not match. This means any task which has child
// tasks, must have matching children.
export const doesTaskHaveMatchingChildren = (task: Task): boolean => {
  const childTasks = selectAll(":root > list listItem", task);
  return Boolean(childTasks.find(isTask));
};

export const filterTasks = (
  root: Parent,
  filterText = "",
  today?: LocalDate,
  showCompleted = false
): Parent => {
  if (filterText === "" && typeof today === "undefined" && showCompleted) {
    return root;
  }

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

      // To match this node, we must match both the date AND text filters
      if (
        doesTaskMatchTodayFilter(task, today) &&
        doesTaskMatchFilter(task, filterText)
      ) {
        return task;
      }

      return [];
    }
    return task;
  });
};
