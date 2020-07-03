import { InlineCode, ListItem } from 'mdast';
import { DATA_KEYS, KEY_VALUE_SEPARATOR } from './constants';
import { TaskListItem } from './types';
import { Dayjs } from 'dayjs';
import { nanoid } from '@reduxjs/toolkit';

export const identity = <T>(p: T): T => p;

export const isDataInlineCode = (input: InlineCode): boolean => {
  const [key] = input.value.split(KEY_VALUE_SEPARATOR);
  // NOTE: We need to coerce the type here otherwise .includes() complains
  return DATA_KEYS.includes(key as any);
};

export const isListItemWithCheckedField = (item: ListItem): boolean => {
  if (typeof item.checked === 'undefined' || item.checked === null) {
    return false;
  }
  return true;
};

export const isTaskListItem = (item: ListItem): item is TaskListItem => {
  // A task may contain exactly 1 child paragraph, and optionally, 1 child list,
  // but absolutely nothing else, even though many other things are valid
  // markdown and mdast
  const hasOneChild = item.children.length === 1;
  const hasTwoChildren = item.children.length === 2;

  if (!hasOneChild && !hasTwoChildren) {
    return false;
  }

  if (item.children[0].type !== 'paragraph') {
    return false;
  }

  if (hasTwoChildren && item.children[1].type !== 'list') {
    return false;
  }

  return true;
};

export const stringifyDayjs = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};

export const createId = () => {
  return nanoid(5);
};

export const isEmpty = (value: any) => {
  if (typeof value === 'undefined') {
    return true;
  }
  if (typeof value === 'string' && value.length > 0) {
    return false;
  }
  if (Array.isArray(value) && value.length > 0) {
    return false;
  }
  if (value === null) {
    return true;
  }
  return false;
};

/**
 * Remove empty properties from an object. An empty property is undefined, an
 * empty string, an empty array, or null. But false and 0 are not removed.
 */
export const removeEmptyProperties = (input: { [prop: string]: any }) => {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => isEmpty(value))
  );
};
