import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Section, Task } from '../../types';

export const REDUX_KEY = 'data';

type State = {
  sections: Section[];
  tasks: Task[];
};
const initialState: State = {
  sections: [],
  tasks: [],
};

const sectionSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
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
  },
});

export const {
  setSections,
  setTasks,
  newSection,
  newTask,
} = sectionSlice.actions;

export default sectionSlice.reducer;
