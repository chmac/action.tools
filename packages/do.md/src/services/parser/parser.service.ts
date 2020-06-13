import stringify from 'fast-json-stable-stringify';
import { BlockContent, Content, Heading, List, ListItem, Root } from 'mdast';
import {
  isHeading,
  isInlineCode,
  isList,
  isParagraph,
} from 'mdast-util-is-type';
import toString from 'mdast-util-to-string';
import { DATA_KEYS, KEY_VALUE_SEPARATOR } from '../../constants';
import { Task, TaskData } from '../../types';
import { isDataInlineCode } from '../../utils';

export const createIdForTask = ({
  data,
  text,
}: {
  data: TaskData;
  text: string;
}): string => {
  // Best case, get the ID from our data, this is sourced from markdown, and is
  // guaranteed (hopefully) stable
  if (typeof data.id === 'string') {
    return data.id;
  }

  // Next best case, build a deterministic ID based on the content of the task
  return stringify({ data, text });
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

export const listItemToTaskFactory = (parentId?: string) => (
  item: ListItem
): Task => {
  if (typeof item.checked === 'undefined') {
    throw new Error('listItemToTask() called without checked field #GgmU22');
  }

  const data = getDataFromListItem(item);
  const text = getTextFromListItem(item);
  const id = createIdForTask({ data, text });

  const contents = item.children.reduce<BlockContent[]>((acc, node) => {
    if (!isList(node)) {
      return acc.concat(node);
    }
    return acc;
  }, []);

  return {
    id,
    parentId,
    finished: item.checked,
    text,
    contents,
    data,
  };
};

export const _recusrseOverListItems = ({
  list,
  depth,
  parentId,
}: {
  list: List;
  depth: number;
  parentId: string;
}): Task[] => {
  const tasks = list.children.flatMap(listItem => {
    const task = listItemToTaskFactory(parentId)(listItem);

    const taskId = task.id;

    const nestedTasks = listItem.children.filter(isList).flatMap(list => {
      return _recusrseOverListItems({
        list,
        depth: depth + 1,
        parentId: taskId,
      });
    });

    return [task].concat(nestedTasks);
  });

  return tasks;
};

export const listToTasks = (list: List) => {
  return _recusrseOverListItems({ list, depth: 0, parentId: '' });
};

type Section = {
  depth: number;
  heading?: Heading;
  contents: Content[];
  tasks: Task[];
  sequence: number;
};

type UnsequencedSection = Omit<Section, 'sequence'>;

const getEmptySection = (): UnsequencedSection => {
  return {
    depth: 0,
    heading: undefined,
    contents: [],
    tasks: [],
  };
};

export const parseMdast = (root: Root): Section[] => {
  const { children } = root;
  /**
   * - Iterate over children
   * - Build a stack of sections
   */
  const sections: UnsequencedSection[] = [];

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
