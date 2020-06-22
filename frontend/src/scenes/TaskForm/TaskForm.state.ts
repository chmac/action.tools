import { createSlice } from "@reduxjs/toolkit";

export const REDUX_KEY = "TaskForm";

const slice = createSlice({
  name: "app/TaskForm",
  initialState: {
    isOpen: false,
  },
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { open, close, toggle } = slice.actions;

export default slice.reducer;
