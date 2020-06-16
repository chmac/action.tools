import { Content, ListItem, PhrasingContent, Root, Paragraph } from 'mdast';
import { KEY_VALUE_SEPARATOR } from '../../constants';
import { Section, Task, TaskData } from '../../types';
import unified from 'unified';
import markdown from 'remark-parse';

const toMdastProcessor = unified().use(markdown, { gfm: true });

export const serializeData = (data: TaskData) => {
  // NOTE: This will have an extra space as the first element
  const children: PhrasingContent[] = Object.entries(data).flatMap(
    ([key, value]) => {
      return [
        { type: 'text', value: ' ' },
        {
          type: 'inlineCode',
          value: `${key}${KEY_VALUE_SEPARATOR}${value}`,
        },
      ];
    }
  );

  // NOTE: This check is necessary because the next `.splice()` will apply
  // whether or not there are any elements in the array. If there is data, we
  // want to return an empty array, and not a break.
  if (children.length === 0) {
    return children;
  }

  // Replace the first space with a break instead
  children.splice(0, 1, { type: 'break' });

  return children;
};

export const recursiveTaskToMdast = ({
  tasks,
  taskId,
}: {
  tasks: Task[];
  taskId: string;
}) => {
  const task = tasks.find(task => task.id === taskId);
  if (typeof task === 'undefined') {
    throw new Error(
      'recursiveTaskToMdast() called with invalid taskId #iuLSAf'
    );
  }
  // NOTE: We only allow 1 child paragraph and 1 child list

  const root = toMdastProcessor.parse(task.contentMarkdown) as Root;
  const paragraph = root.children[0] as Paragraph;

  const dataContent = serializeData(task.data);
  paragraph.children.push(...dataContent);

  const childTasks = tasks.filter(task => task.parentId === taskId);
  const hasChildTasks = childTasks.length > 0;

  const children: Content[] = [paragraph];

  if (hasChildTasks) {
    const childListItems = childTasks.map(task =>
      recursiveTaskToMdast({ tasks, taskId: task.id })
    );
    children.push({
      type: 'list',
      // NOTE: We assume that if 1 child task is sequential, they must all be,
      // because this list must be an ordered (numbered) list.
      ordered: childTasks[0].isSequential,
      spread: false,
      children: childListItems,
    });
  }

  const mdast = {
    type: 'listItem',
    checked: task.isTask ? task.finished : null,
    spread: false,
    children,
  } as ListItem;
  return mdast;
};

export const createMdast = ({
  sections,
  tasks,
}: {
  sections: Section[];
  tasks: Task[];
}): Root => {
  const children: Content[] = [];
  sections.forEach(section => {
    if (typeof section.heading !== 'undefined') {
      children.push(section.heading);
    }
    children.push(...section.contents);

    const sectionTasks = tasks.filter(
      task => task.sectionId === section.id && task.parentId === ''
    );

    if (sectionTasks.length === 0) {
      return;
    }

    const listItems = sectionTasks.map(task =>
      recursiveTaskToMdast({ tasks, taskId: task.id })
    );

    children.push({
      type: 'list',
      spread: false,
      // NOTE: We assume that if 1 child task is sequential, they must all be,
      // because this list must be an ordered (numbered) list.
      ordered: sectionTasks[0].isSequential,
      children: listItems,
    });
  });

  return { type: 'root', children };
};
