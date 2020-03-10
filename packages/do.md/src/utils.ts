import * as R from "remeda";
import * as u from "unist-builder";
import reduce from "unist-util-reduce";
import { Node, Parent } from "unist";
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

export const getValueFromNode = (node: Node): string => {
  if (typeof node.value === "string") {
    return node.value;
  }
  return "";
};

export const getKeyValue = (key: string, task: Task): string => {
  const inlineCodes = selectAll("paragraph > inlineCode", task);
  if (inlineCodes.length === 0) {
    return "";
  }

  // Check the tasks direct children to see if we find an `inlineCode`
  const matches = inlineCodes.filter(node => {
    if (startsWith(`${key}${KEY_VALUE_SEPARATOR}`, getValueFromNode(node))) {
      return true;
    }
    return false;
  });

  if (matches.length === 0) {
    return "";
  }

  if (matches.length > 1) {
    throw new Error("Found multiple matches for key value pair #NLqNJZ");
  }

  const keyValueString = getValueFromNode(matches[0]);

  const value = removeFromFront(`${key}${KEY_VALUE_SEPARATOR}`, keyValueString);

  return value;
};

export const hasKeyValue = (key: string, task: Task): boolean => {
  const value = getKeyValue(key, task);
  return value.length !== 0;
};

export const setKeyValue = (key: string, value: string, task: Task): Task => {
  // First we check that the `task` only has a single child paragraph tag, we're
  // not (yet) handling multiple paragraph tags.
  const paragraph = selectAll("paragraph", task);
  if (paragraph.length !== 1) {
    throw new Error("Unknown Error. More than one paragraph. #riCoag");
  }

  let foundMatch = false;

  return reduce(task, node => {
    const valueString = `${key}${KEY_VALUE_SEPARATOR}${value}`;
    if (
      node.type === "inlineCode" &&
      startsWith(`${key}${KEY_VALUE_SEPARATOR}`, getValueFromNode(node))
    ) {
      foundMatch = true;
      return R.set(node, "value", valueString);
    }

    if (node.type === "paragraph" && !foundMatch) {
      const newChild = u("inlineCode", { value: valueString });
      const { children, ...rest } = node as Parent;
      return { ...rest, children: children.concat(newChild) };
    }

    return node;
  });
};

export const removeKeyValue = (key: string, task: Task): Task => {
  return reduce(task, node => {
    if (node.type === "inlineCode") {
      const value = getValueFromNode(node);
      if (startsWith(`${key}${KEY_VALUE_SEPARATOR}`, value)) {
        return [];
      }
      return node;
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
