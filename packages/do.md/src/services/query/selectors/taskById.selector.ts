import { RootState, getLocalState } from '../../../store';

export const taskById = (state: RootState, id: string) => {
  const tasks = getLocalState(state).data.tasks;
  const task = tasks.find(task => task.id === id);

  if (typeof task === 'undefined') {
    throw new Error('Tried to find non existent task. #fUNAfb');
  }

  const hasChildren =
    typeof tasks.find(task => task.parentId === task.id) !== 'undefined';

  return { ...task, hasChildren };
};
