import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { stringifyDayjs } from '../../utils';

export const REDUX_KEY = 'query';

type State = {
  today: string;
  currentContexts: string[];
};
const initialState: State = {
  today: '',
  currentContexts: [],
};

const querySlice = createSlice({
  name: 'domd/query',
  initialState,
  reducers: {
    // [init.type]: (state, action) => {
    //   state.today = action.payload.today;
    // },
    init: {
      prepare: () => {
        return {
          payload: {
            today: stringifyDayjs(dayjs()),
          },
        };
      },
      reducer: (state, action: PayloadAction<{ today: string }>) => {
        state.today = action.payload.today;
      },
    },
    setCurrentContexts: (state, action: PayloadAction<string[]>) => {
      state.currentContexts = action.payload;
    },
    addContext: (state, action: PayloadAction<string>) => {
      if (state.currentContexts.find(c => c === action.payload)) {
        return;
      }
      state.currentContexts.push(action.payload);
    },
    removeContext: (state, action: PayloadAction<string>) => {
      const index = state.currentContexts.findIndex(c => c === action.payload);
      if (index !== -1) {
        state.currentContexts.splice(index, 1);
      }
    },
  },
});

export const {
  init,
  setCurrentContexts,
  addContext,
  removeContext,
} = querySlice.actions;

export default querySlice.reducer;
