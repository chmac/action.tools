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
  },
});

export const { init, setCurrentContexts } = querySlice.actions;

export default querySlice.reducer;
