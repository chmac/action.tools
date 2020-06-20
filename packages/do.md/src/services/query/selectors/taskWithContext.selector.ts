import { RootState } from '../../../store';
import { sectionTitles } from './sectionTitles.selector';
import { taskById } from './taskById.selector';

// Get parents recursively
const getTaskWithParentsRecursively = ({
  rootState,
  taskId,
}: {
  rootState: RootState;
  taskId: string;
}): ReturnType<typeof taskById>[] => {
  const task = taskById(rootState, taskId);
  if (task.parentId === '') {
    return [task];
  }
  const parents = getTaskWithParentsRecursively({
    rootState,
    taskId: task.parentId,
  });
  return [task].concat(...parents);
};

export const taskWithContext = (rootState: RootState, taskId: string) => {
  const tasks = getTaskWithParentsRecursively({ rootState, taskId });
  const titles = sectionTitles(rootState, tasks[0].sectionId);
  return { tasks, titles };
};
