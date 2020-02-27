import { Node, Parent } from "unist";
import reduce from "unist-util-reduce";
import { select } from "unist-util-select";

import { isTask, hasKeyValue, getTitle } from "./utils";
import { calculateNextIteration } from "./calculateNextIteration";
import { REPEAT, FINISHED } from "./constants";
import { Task } from "./types";

const doesTaskMatchFilter = (task: Task, filterText = ""): boolean => {
  const title = getTitle(task);
  return title.indexOf(filterText) !== -1;
};

// The `reduce()` runs depth first, starting from the deepest nodes and working
// upwards. By the time it runs for a parent task, the children will already
// have been removed if they do not match. This means any task which has child
// tasks, must have matching children.
const doesTaskHaveMatchingChildren = (task: Task): boolean => {
  const childTask = select(":root > list > listItem", task);
  return Boolean(childTask);
};

export const filterTasks = (root: Parent, filterText = ""): Parent => {
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
