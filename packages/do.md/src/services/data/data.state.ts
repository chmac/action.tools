import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { Section, Task } from '../../types';
import dayjs from 'dayjs';
import { stringifyDayjs } from '../../utils';
import { difference } from 'remeda';

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

export const snoozeTask = createAction(
  'snoozeTask',
  ({ id, daysFromToday }: { id: string; daysFromToday: number }) => {
    return {
      payload: {
        id,
        snooze: stringifyDayjs(dayjs().add(daysFromToday, 'day')),
      },
    };
  }
);

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
    addContextsToTask: (
      state,
      action: PayloadAction<{ id: string; newContexts: string[] }>
    ) => {
      const taskIndex = getTaskIndex(state, action.payload.id);
      const task = state.tasks[taskIndex];

      // If there are no existing contexts, just return the new array
      if (typeof task.data.contexts === 'undefined') {
        task.data.contexts = action.payload.newContexts;
        return;
      }

      // Find contexts which are new
      const insertContexts = difference(
        action.payload.newContexts,
        task.data.contexts
      );

      // If there are no new contexts, do nothing, return
      if (insertContexts.length === 0) {
        return;
      }

      task.data.contexts = task.data.contexts.concat(insertContexts);
    },
  },
  extraReducers: builder => {
    builder.addCase(snoozeTask, (state, action) => {
      const taskIndex = getTaskIndex(state, action.payload.id);
      state.tasks[taskIndex].data.snooze = action.payload.snooze;
    });
  },
});

export const {
  setData,
  newSection,
  newTask,
  finishTask,
  unfinishTask,
  addContextsToTask,
} = sectionSlice.actions;

export default sectionSlice.reducer;
