import { Parent, Node } from "unist";
import * as visit from "unist-util-visit";

import { isTask } from "./utils";
import { doesTaskHaveMatchingChildren } from "./filter";

export const countTasks = (root: Parent): number => {
  let count = 0;
  visit(root, "listItem", (node: Node) => {
    if (isTask(node)) {
      count++;
    }
  });
  return count;
};

export const countLeafTasks = (root: Parent): number => {
  let count = 0;
  visit(root, "listItem", (node: Node) => {
    if (isTask(node) && !doesTaskHaveMatchingChildren(node)) {
      count++;
    }
  });
  return count;
};
