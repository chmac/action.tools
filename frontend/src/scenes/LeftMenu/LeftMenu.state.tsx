import { createSlice } from "@reduxjs/toolkit";

export const REDUX_KEY = "LeftMenu";

const initialState = {
  isOpen: false,
};

const slice = createSlice({
  name: "app/Routes",
  initialState,
  reducers: {
    toggleIsOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleIsOpen } = slice.actions;

export default slice.reducer;
