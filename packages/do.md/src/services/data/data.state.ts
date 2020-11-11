import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { difference } from 'remeda';
import { REDUX_ROOT_KEY } from '../../constants';
import { AppThunk, RootState } from '../../store';
import { Section, Task } from '../../types';
import { removeEmptyProperties, stringifyDayjs } from '../../utils';
import { createNextIteration } from '../repeat/repeat.service';

export const REDUX_KEY = 'data';

const getState = (state: RootState) => state[REDUX_ROOT_KEY][REDUX_KEY];

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
  const taskIndex = state.tasks.findIndex((task) => task.id === id);
  if (typeof taskIndex === 'undefined') {
    throw new Error('Failed to find task by ID #1INCd9');
  }
  return taskIndex;
};

export const snoozeTask = createAction(
  'domd/data/snoozeTask',
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
      const { data, ...rest } = action.payload.task;
      const task = { ...rest, data: removeEmptyProperties(data) };
      state.tasks.splice(action.payload.insertAtIndex, 0, task);
    },
    closeTaskWithoutRepeating: (state, action: PayloadAction<string>) => {
      const taskIndex = getTaskIndex(state, action.payload);
      state.tasks[taskIndex].finished = true;
    },
    unfinishTask: (state, action: PayloadAction<string>) => {
      const taskIndex = getTaskIndex(state, action.payload);
      state.tasks[taskIndex].finished = false;
    },
    /**
     * Update a task. Setting any value to an empty string (or empty array)
     * will remove that field.
     */
    updateTask: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Omit<Task, 'id'>> }>
    ) => {
      const taskIndex = getTaskIndex(state, action.payload.id);

      const data = removeEmptyProperties({
        ...state.tasks[taskIndex].data,
        ...action.payload.changes.data,
      });

      state.tasks[taskIndex] = {
        ...state.tasks[taskIndex],
        ...action.payload.changes,
        data,
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
  extraReducers: (builder) => {
    builder.addCase(snoozeTask, (state, action) => {
      const taskIndex = getTaskIndex(state, action.payload.id);
      state.tasks[taskIndex].data.snooze = action.payload.snooze;
    });
    // .addCase(finishTask, (state, action) => {
    //   const taskIndex = getTaskIndex(state, action.payload.id);

    //   // NOTE: This must happen BEFORE the `.splice()` call as it will
    //   // change the index order of the array.
    //   state.tasks[taskIndex].finished = true;
    //   state.tasks.splice(taskIndex, 0, action.payload.id);
    // });
  },
});

export const {
  setData,
  newSection,
  newTask,
  unfinishTask,
  closeTaskWithoutRepeating,
  updateTask,
  addContextsToTask,
} = sectionSlice.actions;

export default sectionSlice.reducer;

export const finishTask = (id: string): AppThunk => async (
  dispatch,
  getRootState
) => {
  const rootState = getRootState();
  const state = getState(rootState);

  const taskIndex = getTaskIndex(state, id);
  const task = state.tasks[taskIndex];

  dispatch(closeTaskWithoutRepeating(id));

  // If this task has no repetition, then stop here
  if (typeof task.data.repeat === 'undefined') {
    return;
  }

  const today = rootState[REDUX_ROOT_KEY].query.today;

  const nextIteration = createNextIteration({
    task,
    today,
  });

  dispatch(newTask({ task: nextIteration, insertAtIndex: taskIndex }));
};
