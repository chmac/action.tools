import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const REDUX_KEY = "storage";

const initialState = {
  lastCommitHash: "",
  commitsAhead: 0,
};

const storageSlice = createSlice({
  name: "app/storage",
  initialState,
  reducers: {
    addCommitsAhead: {
      prepare: (count = 1) => {
        return {
          payload: count,
        };
      },
      reducer: (state, action: PayloadAction<number>) => {
        state.commitsAhead = state.commitsAhead + action.payload;
      },
    },
    resetCommitsAhead: (state) => {
      state.commitsAhead = 0;
    },
    setCommitsAhead: (state, action: PayloadAction<number>) => {
      state.commitsAhead = action.payload;
    },
    setLastCommitHash: (state, action: PayloadAction<string>) => {
      state.lastCommitHash = action.payload;
    },
  },
});

export const {
  addCommitsAhead,
  resetCommitsAhead,
  setCommitsAhead,
  setLastCommitHash,
} = storageSlice.actions;

export default storageSlice.reducer;
