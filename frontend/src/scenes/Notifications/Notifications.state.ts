import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import { AppState } from "../../store";

export const REDUX_KEY = "Notifications";
const getLocalState = (state: AppState) => state[REDUX_KEY];

export type Notice = {
  message: string;
  type: "error" | "warning" | "info" | "success";
};

type LoggedNotice = {
  id: string;
  notice: Notice;
  time: number;
  flashed: boolean;
};

const noticeAdapter = createEntityAdapter<LoggedNotice>();

const slice = createSlice({
  name: "app/Notifications",
  initialState: noticeAdapter.getInitialState(),
  reducers: {
    push: {
      prepare: ({ notice }: { notice: Notice }) => {
        return {
          payload: {
            notice,
            time: Math.round(Date.now() / 1e3),
            flashed: false,
            id: nanoid(),
          },
        };
      },
      reducer: noticeAdapter.addOne,
    },
    setFlashed: {
      prepare: (id) => {
        return { payload: { id, changes: { flashed: true } } };
      },
      reducer: noticeAdapter.updateOne,
    },
  },
});

export const { push, setFlashed } = slice.actions;

export const { selectAll } = noticeAdapter.getSelectors(getLocalState);

export default slice.reducer;
