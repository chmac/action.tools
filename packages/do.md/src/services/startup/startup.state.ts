import { createSlice } from '@reduxjs/toolkit';

export const REDUX_KEY = 'startup';

const initialState = {
  initialDataLoadFinished: false,
};

const startupSlice = createSlice({
  name: 'domd/startup',
  initialState,
  reducers: {
    setInitialDataLoadFinished: state => {
      state.initialDataLoadFinished = true;
    },
  },
});

export const { setInitialDataLoadFinished } = startupSlice.actions;

export default startupSlice.reducer;
