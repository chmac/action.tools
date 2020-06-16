import { Content, ListItem, PhrasingContent, Root } from 'mdast';
import { KEY_VALUE_SEPARATOR } from '../../constants';
import { Section, Task, TaskData } from '../../types';

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
  const childTasks = tasks.filter(task => task.parentId === taskId);
  const mdast = {
    type: 'listItem',
    checked: task.finished,
    children: [
      ...task.contents,
      ...serializeData(task.data),
      ...(childTasks.length > 0
        ? [
            {
              type: 'list',
              children: childTasks.map(task =>
                recursiveTaskToMdast({ tasks, taskId: task.id })
              ),
            },
          ]
        : []),
    ],
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

    const sectionTasks = tasks.filter(task => task.sectionId === section.id);

    const listItems = sectionTasks.map(task =>
      recursiveTaskToMdast({ tasks, taskId: task.id })
    );

    children.push({
      type: 'list',
      children: listItems,
    });
  });

  return { type: 'root', children };
};