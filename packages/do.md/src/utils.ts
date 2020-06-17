import { InlineCode, ListItem } from 'mdast';
import { DATA_KEYS, KEY_VALUE_SEPARATOR } from './constants';
import { TaskListItem } from './types';

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
