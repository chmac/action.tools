import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    init: (state, action: PayloadAction<{ today: string }>) => {
      state.today = action.payload.today;
    },
    setCurrentContexts: (state, action: PayloadAction<string[]>) => {
      state.currentContexts = action.payload;
    },
  },
});

export const { init, setCurrentContexts } = querySlice.actions;

export default querySlice.reducer;
