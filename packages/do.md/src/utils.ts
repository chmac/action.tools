import * as R from "remeda";
import { Node, Parent } from "unist";
import * as visit from "unist-util-visit";
import { selectAll } from "unist-util-select";

import { Task } from "./types";
import { REGEX_SUFFIX, KEY_VALUE_SEPARATOR } from "./constants";

export const isTask = (node: Node): node is Task => {
  return node.type === "listItem" && typeof node.checked === "boolean";
};

export const getTitle = (task: Task): string => {
  if (!isTask(task)) {
    throw new Error("getTitle() was called on a non task #3RAdcI");
  }

  return R.map(
    selectAll(":root > paragraph > text", task),
    R.prop("value")
  ).join(" ");
};

export const startsWith = (target: string, input: string): boolean => {
  return input.substr(0, target.length).toLowerCase() === target;
};

export const removeFromFront = (target: string, input: string): string => {
  if (!startsWith(target, input)) {
    return input;
  }
  return input.substr(target.length);
};

export const getKeyValue = (key: string, task: Task): string => {
  // TODO Expand to support nested lists without checkboxes
  const text = getTitle(task);
  // NOTE: We set the `i` flag on this regex because we want to match both KEY
  // and key
  const regex = new RegExp(`${key}${KEY_VALUE_SEPARATOR}${REGEX_SUFFIX}`, "gi");

  const matches = text.match(regex);

  if (matches === null) {
    return "";
  } else if (matches.length === 1) {
    return removeFromFront(`${key}${KEY_VALUE_SEPARATOR}`, matches[0]);
  }

  throw new Error("Found multiple matches for key value pair #NLqNJZ");
};

export const getTags = (prefix: string, task: Task): string[] => {
  // TODO Expand to support nested lists without checkboxes
  const text = getTitle(task);
  const regex = new RegExp(`${prefix}${REGEX_SUFFIX}`, "g");

  const matches = text.match(regex);

  return matches || [];
};
