import { RootState, getLocalState } from '../../../store';

export const taskById = (state: RootState, id: string) => {
  return getLocalState(state).data.tasks.find(task => task.id === id);
};
