import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const REDUX_KEY = "now";

type State = {
  taskIds: string[];
};
const initialState: State = {
  taskIds: [],
};

const nowSlice = createSlice({
  name: "app/now",
  initialState,
  reducers: {
    addId: (state, action: PayloadAction<string>) => {
      state.taskIds.push(action.payload);
    },
    removeId: (state, action: PayloadAction<string>) => {
      const idIndex = state.taskIds.indexOf(action.payload);
      state.taskIds.splice(idIndex, 1);
    },
  },
});

export const { addId, removeId } = nowSlice.actions;

export default nowSlice.reducer;
