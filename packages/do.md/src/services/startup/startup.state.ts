import { createSlice } from '@reduxjs/toolkit';

export const REDUX_KEY = 'startup';

const initialState = {
  empty: true,
};

const startupSlice = createSlice({
  name: 'domd/startup',
  initialState,
  reducers: {
    nothing: state => {
      state.empty = true;
    },
  },
});

export const { nothing } = startupSlice.actions;

export default startupSlice.reducer;
