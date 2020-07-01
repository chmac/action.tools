import { getLocalState, RootState } from '../../../store';
import { Task } from '../../../types';

export const isTask = (task: Task) => task.isTask;

export const selectTasks = (rootState: RootState) => {
  const tasks = getLocalState(rootState).data.tasks;

  return tasks.filter(isTask);
};
