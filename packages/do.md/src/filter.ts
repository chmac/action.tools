import { Node, Parent } from "unist";
import reduce from "unist-util-reduce";
import { select } from "unist-util-select";

import { isTask, getTitle } from "./utils";
import { Task } from "./types";
import { LocalDate } from "@js-joda/core";

export const doesTaskMatchFilter = (task: Task, filterText = ""): boolean => {
  const title = getTitle(task);
  return title.indexOf(filterText) !== -1;
};

// The `reduce()` runs depth first, starting from the deepest nodes and working
// upwards. By the time it runs for a parent task, the children will already
// have been removed if they do not match. This means any task which has child
// tasks, must have matching children.
export const doesTaskHaveMatchingChildren = (task: Task): boolean => {
  const childTask = select(":root > list > listItem", task);
  return Boolean(childTask);
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
