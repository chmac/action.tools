import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const init = createAction('init', () => {
  return {
    payload: {
      today: stringifyDayjs(dayjs()),
    },
  };
});

const querySlice = createSlice({
  name: 'domd/query',
  initialState,
  reducers: {
    [init.type]: (state, action) => {
      state.today = action.payload.today;
    },
    setCurrentContexts: (state, action: PayloadAction<string[]>) => {
      state.currentContexts = action.payload;
    },
  },
});

export const { setCurrentContexts } = querySlice.actions;

export default querySlice.reducer;
