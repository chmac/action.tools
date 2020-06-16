import stringify from 'fast-json-stable-stringify';
import { BlockContent, List, ListItem, Root } from 'mdast';
import {
  isHeading,
  isInlineCode,
  isList,
  isParagraph,
} from 'mdast-util-is-type';
import toString from 'mdast-util-to-string';
import { clone, equals } from 'remeda';
import removePosition from 'unist-util-remove-position';
import stringifyPosition from 'unist-util-stringify-position';
import {
  DATA_KEYS,
  KEY_VALUE_SEPARATOR,
  TOP_SECTION_ID,
} from '../../constants';
import { Section, Task, TaskData } from '../../types';
import { isDataInlineCode } from '../../utils';

type TaskWithoutSectionId = Omit<Task, 'sectionId'>;

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

export const createIdForSection = (section: Omit<Section, 'id'>): string => {
  const { heading } = section;

  if (typeof heading === 'undefined') {
    const { position } = section.contents[0] || {};
    if (typeof position === 'undefined') {
      // There should only be one section which has no content and no heading.
      // This would be the very first section if the markdown file begins with a
      // task list.
      return TOP_SECTION_ID;
    }
    return stringifyPosition(position);
  }

  const { position } = heading;

  if (typeof position === 'undefined') {
    throw new Error('Trying to create ID without position #8wjJcb');
  }

  return stringifyPosition(position);
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

export const listItemToTaskFactory = ({
  parentId = '',
  isSequential,
}: {
  parentId?: string;
  isSequential: boolean;
}) => (item: ListItem): TaskWithoutSectionId => {
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
    isSequential,
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
}): TaskWithoutSectionId[] => {
  const tasks = list.children.flatMap(listItem => {
    const task = listItemToTaskFactory({
      parentId,
      isSequential: list.ordered || false,
    })(listItem);

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

type SectionWithTasks = Section & {
  tasks: Omit<Task, 'sectionId'>[];
};

type SectionWithTasksWithoutId = Omit<SectionWithTasks, 'id'>;

const emptySection = {
  depth: 0,
  heading: undefined,
  contents: [],
  tasks: [],
};
const getEmptySection = (): SectionWithTasksWithoutId => {
  return clone(emptySection);
};

const isSectionEmpty = (section: SectionWithTasksWithoutId): boolean => {
  return equals(section, emptySection);
};

const stripPositionsFromTask = (
  task: TaskWithoutSectionId
): TaskWithoutSectionId => {
  return {
    ...task,
    contents: task.contents.map(node => removePosition(node)),
  };
};

const stripPositionsFromSection = (
  section: SectionWithTasks
): SectionWithTasks => {
  return {
    ...section,
    contents: section.contents.map(node => removePosition(node)),
    heading:
      typeof section.heading === 'undefined'
        ? section.heading
        : removePosition(section.heading),
    tasks: section.tasks.map(stripPositionsFromTask),
  };
};

export const parseMdast = (
  root: Root,
  { stripPositions = true }: { stripPositions?: boolean } = {}
): SectionWithTasks[] => {
  const { children } = root;
  /**
   * - Iterate over children
   * - Build a stack of sections
   */
  const sections: SectionWithTasksWithoutId[] = [];

  let currentSection: SectionWithTasksWithoutId = getEmptySection();

  /**
   * - Iterate over the root's children
   * - Start with an "empty" section with the ID "top"
   * - When reaching a heading:
   *   - Start a new section
   *   - Set the heading on the new section
   * - When reaching a list:
   *   - Add the tasks to the current section
   *   - Start a new section
   */

  children.forEach(node => {
    if (!isList(node)) {
      if (isHeading(node)) {
        // Firstly, if there is anything in the current section, save it and
        // start a new section. The heading should always be the first thing we
        // add to a section.
        if (!isSectionEmpty(currentSection)) {
          sections.push(currentSection);
          currentSection = getEmptySection();
        }

        // Now that we know the current section is empty, add the heading we
        // just found to it.
        currentSection.heading = node;
      } else {
        // If we reach a node that is not a list, and not a heading, then add it
        // to the currently open section
        currentSection.contents.push(node);
      }
    } else {
      // When we find a list, we always add to the current section and start a
      // new section
      currentSection.tasks = listToTasks(node);
      sections.push(currentSection);
      currentSection = getEmptySection();
    }
  });

  if (!isSectionEmpty(currentSection)) {
    sections.push(currentSection);
  }

  const sectionsWithIds = sections.map(section => {
    return {
      ...section,
      id: createIdForSection(section),
    };
  });

  if (!stripPositions) {
    return sectionsWithIds;
  }

  const sectionsWithIdsWithoutPositions = sectionsWithIds.map(
    stripPositionsFromSection
  );

  return sectionsWithIdsWithoutPositions;
};
