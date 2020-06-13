import { Content, Heading, List, ListItem, Root } from 'mdast';
import {
  isHeading,
  isInlineCode,
  isList,
  isParagraph,
} from 'mdast-util-is-type';
import toString from 'mdast-util-to-string';
import { nanoid } from 'nanoid';
import { DATA_KEYS, KEY_VALUE_SEPARATOR } from '../../constants';
import { Task, TaskData } from '../../types';
import { isDataInlineCode } from '../../utils';

export const getIdFromList = (list: List): string => {
  // If we have position information, this will uniquely identify the list
  if (typeof list.position !== 'undefined') {
    return JSON.stringify(list.position);
  }

  // Otherwise, generate a random ID
  return nanoid();
};

// NOTE: We use a separate function in case we want to change implementation
// later. We use a type coercion so the two functions use the same
// implementation but different input types.
export const createIdForListItem = (item: ListItem) => {
  // If we have position information, this will uniquely identify the list
  if (typeof item.position !== 'undefined') {
    return JSON.stringify(item.position);
  }

  // Otherwise, generate a random ID
  return nanoid();
};

export const getDataFromListItem = (item: ListItem): TaskData => {
  const dataPairs: string[][] = [];

  item.children.forEach(possiblyParagraph => {
    if (isParagraph(possiblyParagraph)) {
      possiblyParagraph.children.forEach(content => {
        if (isInlineCode(content)) {
          const [key, value] = content.value.split(KEY_VALUE_SEPARATOR);
          if (DATA_KEYS.includes(key as any)) {
            dataPairs.push([key, value]);
          }
        }
      });
    }
  });

  return Object.fromEntries(dataPairs);
};

export const getTextFromListItem = (item: ListItem): string => {
  const texts = item.children.reduce<string[]>((texts, child) => {
    if (isParagraph(child)) {
      const childTexts = child.children.reduce<string[]>(
        (texts, grandchild) => {
          if (!isInlineCode(grandchild) || !isDataInlineCode(grandchild)) {
            const granchildText = toString(grandchild).trim();
            if (granchildText.trim() !== '') {
              return texts.concat(granchildText);
            }
          }
          return texts;
        },
        []
      );
      return texts.concat(childTexts);
    }
    return texts;
  }, []);

  return texts.join(`\n`);
};

export const _recusrseOverListItems = ({
  list,
  depth,
  parentIds,
}: {
  list: List;
  depth: number;
  parentIds: string[];
}) => {
  const { children } = list;

  const listId = getIdFromList(list);

  const tasks: Task[] = [];

  children.forEach(item => {
    if (typeof item.checked !== 'boolean') {
      // This is a regular list item and not a task inside, we're not able to
      // handle this
      throw new Error('Regular list inside of a task #bJ2XJp');
    }

    const data = getDataFromListItem(item);

    const taskId = data.id || createIdForListItem(item);

    const text = getTextFromListItem(item);

    tasks.push({
      ...item,
      text,
      id: taskId,
      data: {
        ...data,
      },
    });

    // Recursively search through children and parse any nested lists
    item.children.forEach(child => {
      if (isList(child)) {
        const childTasks = _recusrseOverListItems({
          list: child,
          depth: depth + 1,
          parentIds: parentIds.concat(listId),
        });
        tasks.push(...childTasks);
      }
    });
  });

  return tasks;
};

export const listToTasks = (list: List) => {
  return _recusrseOverListItems({ list, depth: 0, parentIds: [] });
};

type FoundSection = {
  depth: number;
  heading?: Heading;
  contents: Content[];
  tasks: Task[];
};

type ReturnSection = FoundSection & {
  sequence: number;
};

const getEmptySection = (): FoundSection => {
  return {
    depth: 0,
    heading: undefined,
    contents: [],
    tasks: [],
  };
};

export const parseMdast = (root: Root): ReturnSection[] => {
  const { children } = root;
  /**
   * - Iterate over children
   * - Build a stack of sections
   */
  const sections: FoundSection[] = [];

  let currentSection = getEmptySection();

  children.forEach(node => {
    if (!isList(node)) {
      if (!isHeading(node)) {
        // If we reach a node that is not a list, and not a heading, then add it
        // to the currently open section
        currentSection.contents.push(node);
      } else {
        // If we find a heading, then close the "currentSection" by pushing it
        // into the array of sections and create a new section starting with
        // this heading
        sections.push(currentSection);
        currentSection = getEmptySection();
        currentSection.heading = node;
      }
    } else {
      currentSection.tasks = listToTasks(node);
    }
  });

  sections.push(currentSection);

  const sequencedSections = sections.map((section, index) => {
    return {
      ...section,
      sequence: index,
    };
  });

  return sequencedSections;
};
