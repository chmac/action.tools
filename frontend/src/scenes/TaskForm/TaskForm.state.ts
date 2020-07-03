import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const REDUX_KEY = "TaskForm";

const slice = createSlice({
  name: "app/TaskForm",
  initialState: {
    isOpen: false,
    editingTaskId: "",
  },
  reducers: {
    openNew: (state) => {
      state.isOpen = true;
      state.editingTaskId = "";
    },
    openEdit: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.editingTaskId = action.payload;
    },
    close: (state) => {
      state.isOpen = false;
      state.editingTaskId = "";
    },
  },
});

export const { openNew: open, openNew, openEdit, close } = slice.actions;

export default slice.reducer;
