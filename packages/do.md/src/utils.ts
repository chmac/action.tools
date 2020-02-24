import * as R from "remeda";
import reduce from "unist-util-reduce";

import { Node } from "unist";
import { selectAll } from "unist-util-select";

import { Task } from "./types";
import {
  REGEX_SUFFIX,
  KEY_VALUE_SEPARATOR,
  KEY_VAR_REGEX_SUFFIX
} from "./constants";

export const getKeyValueRegExp = (key: string): RegExp => {
  return new RegExp(`${key}${KEY_VAR_REGEX_SUFFIX}`);
};

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

export const hasKeyValue = (key: string, task: Task): boolean => {
  const value = getKeyValue(key, task);
  return value.length !== 0;
};

export const setKeyValue = (key: string, value: string, task: Task): Task => {
  return reduce(task, node => {
    if (node.type === "text") {
      const { value: oldValue } = node;
      const replacedString = (oldValue as string).replace(
        getKeyValueRegExp(key),
        `${key}:${value}`
      );

      // If the replacement did not change anything, then the key was not found
      // in the string, in this case append the new key:value pair.
      if (replacedString === oldValue) {
        return R.set(node, "value", `${oldValue} ${key}:${value}`);
      }

      return R.set(node, "value", replacedString);
    }
    return node;
  });
};

export const removeKeyValue = (key: string, task: Task): Task => {
  return reduce(task, node => {
    if (node.type === "text") {
      const { value: oldValue } = node;
      const replacedString = (oldValue as string)
        // NOTE: We replace the `key:value` pair including a LEADING space, and
        // then including a TRAILING space to ensure that we always remove a
        // single space and the pattern itself.
        .replace(new RegExp(` ${key}${KEY_VAR_REGEX_SUFFIX}`), "")
        .replace(new RegExp(`${key}${KEY_VAR_REGEX_SUFFIX} `), "");
      return R.set(node, "value", replacedString);
    }
    return node;
  });
};

export const getTags = (prefix: string, task: Task): string[] => {
  // TODO Expand to support nested lists without checkboxes
  const text = getTitle(task);
  const regex = new RegExp(`${prefix}${REGEX_SUFFIX}`, "g");

  const matches = text.match(regex);

  return matches || [];
};
