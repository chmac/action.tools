import stringify from 'fast-json-stable-stringify';
import { List, ListItem, Root } from 'mdast';
import { isHeading, isInlineCode, isList } from 'mdast-util-is-type';
import remarkStringify from 'remark-stringify';
import { clone, equals } from 'remeda';
import unified from 'unified';
import removePosition from 'unist-util-remove-position';
import stringifyPosition from 'unist-util-stringify-position';
import { KEY_VALUE_SEPARATOR, TOP_SECTION_ID } from '../../constants';
import { Section, Task, TaskData, TaskListItem } from '../../types';
import { isListItemWithCheckedField, isTaskListItem } from '../../utils';

type TaskWithoutSectionId = Omit<Task, 'sectionId'>;

export const createIdForTask = ({
  data,
  contentMarkdown,
}: {
  data: TaskData;
  contentMarkdown: string;
}): string => {
  // Best case, get the ID from our data, this is sourced from markdown, and is
  // guaranteed (hopefully) stable
  if (typeof data.id === 'string') {
    return data.id;
  }

  // Next best case, build a deterministic ID based on the content of the task
  return stringify({ data, contentMarkdown });
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

export const getDataFromListItem = (item: TaskListItem): TaskData => {
  const firstParagraph = item.children[0];

  const data = firstParagraph.children.reduce<TaskData>((data, child) => {
    if (isInlineCode(child)) {
      const [key, value] = child.value.split(KEY_VALUE_SEPARATOR);

      // If the first character of `key` is a @ then this is a context
      if (key[0] === '@') {
        const context = key.substr(1);
        const { contexts } = data;
        return {
          ...data,
          contexts:
            typeof contexts === 'undefined'
              ? [context]
              : contexts.concat(context),
        };
      }

      // If this was not a context, then add this field to the data object
      return { ...data, [key]: value };
    }
    return data;
  }, {});

  return data;
};

const processor = unified().use(remarkStringify, { gfm: true });

/**
 * Given a `ListItem` that represents a task, get the text content only.
 *
 * This means:
 * - Strip out any of our `key:value` fields
 * - Retain any **formatting**
 * - Do not include the leading "- [ ]"
 */
export const getTextFromListItem = (item: TaskListItem): string => {
  // For now, we assume there is a singular paragraph as the first child of all
  // lists
  const firstParagraph = item.children[0];

  const children = firstParagraph.children.filter(child => {
    if (isInlineCode(child)) {
      return false;
    }
    return true;
  });

  const text = processor.stringify({ type: 'paragraph', children });

  const output = text
    .split('\n')
    .map(line => line.trim())
    .filter(trimmedLine => trimmedLine.length > 0)
    // NOTE: We terminate every line with 2 spaces
    .join('  \n');

  return output;
};

export const listItemToTaskFactory = ({
  parentId = '',
  isSequential,
}: {
  parentId?: string;
  isSequential: boolean;
}) => (item: ListItem): TaskWithoutSectionId => {
  if (!isTaskListItem(item)) {
    throw new Error('Unable to handle non conformat list items. #KqOxgO');
  }

  const data = getDataFromListItem(item);
  const contentMarkdown = getTextFromListItem(item);
  const id = createIdForTask({ data, contentMarkdown });

  if (!isListItemWithCheckedField(item)) {
    return {
      id,
      parentId,
      finished: true,
      isSequential,
      isTask: false,
      contentMarkdown,
      // NOTE: Do not set any data if this is not a task
      data: {},
    };
  }

  return {
    id,
    parentId,
    finished: item.checked || false,
    isSequential,
    isTask: true,
    contentMarkdown,
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
