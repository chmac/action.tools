import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Section, Task } from '../../types';

export const REDUX_KEY = 'data';

type State = {
  sections: Section[];
  tasks: Task[];
  initialDataLoadComplete: boolean;
};
const initialState: State = {
  sections: [],
  tasks: [],
  initialDataLoadComplete: false,
};

const getTaskIndex = (state: State, id: string): number => {
  const taskIndex = state.tasks.findIndex(task => task.id === id);
  if (typeof taskIndex === 'undefined') {
    throw new Error('Failed to find task by ID #1INCd9');
  }
  return taskIndex;
};

const sectionSlice = createSlice({
  name: 'domd/data',
  initialState,
  reducers: {
    setData: (
      state,
      action: PayloadAction<{
        sections: Section[];
        tasks: Task[];
      }>
    ) => {
      state.sections = action.payload.sections;
      state.tasks = action.payload.tasks;
      state.initialDataLoadComplete = true;
    },
    newSection: (
      state,
      action: PayloadAction<{ section: Section; insertAtIndex: number }>
    ) => {
      state.sections.splice(
        action.payload.insertAtIndex,
        0,
        action.payload.section
      );
    },
    newTask: (
      state,
      action: PayloadAction<{ task: Task; insertAtIndex: number }>
    ) => {
      state.tasks.splice(action.payload.insertAtIndex, 0, action.payload.task);
    },
    finishTask: (state, action: PayloadAction<string>) => {
      const taskIndex = getTaskIndex(state, action.payload);
      state.tasks[taskIndex].finished = true;
    },
    unfinishTask: (state, action: PayloadAction<string>) => {
      const taskIndex = getTaskIndex(state, action.payload);
      state.tasks[taskIndex].finished = false;
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; changes: Omit<Task, 'id'> }>
    ) => {
      const taskIndex = getTaskIndex(state, action.payload.id);
      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        ...action.payload.changes,
      };
    },
  },
});

export const {
  setData,
  newSection,
  finishTask,
  unfinishTask,
  newTask,
} = sectionSlice.actions;

export default sectionSlice.reducer;
