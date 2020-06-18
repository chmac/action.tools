import { Action } from "redux";
import { AppState } from "../../store";
import { Message } from "./notifications.service";

export const REDUX_KEY = "notifications";

type LogMessage = {
  message: Message;
  time: number;
};

const getState = (state: AppState) => state.notifications;

const PUSH_MESSAGE = `app/notifications/PUSH_MESSAGE`;
interface PushMessageAction extends Action<typeof PUSH_MESSAGE> {
  payload: {
    message: Message;
    time: number;
  };
}
export const pushMessage = (message: Message): PushMessageAction => {
  return {
    type: PUSH_MESSAGE,
    payload: {
      message,
      time: Math.round(Date.now() / 1e3),
    },
  };
};

const RESET = `app/notifications/RESET`;
interface ResetAction extends Action<typeof RESET> {
  payload: {};
}
export const reset = (): ResetAction => {
  return {
    type: RESET,
    payload: {},
  };
};

type NotificationActions = PushMessageAction | ResetAction;

type State = {
  log: LogMessage[];
};

const empty = {
  log: [],
};

const reducer = (state: State = empty, action: NotificationActions): State => {
  switch (action.type) {
    case PUSH_MESSAGE: {
      console.log(action);
      return {
        ...state,
        log: state.log.concat(action.payload),
      };
    }

    case RESET: {
      return empty;
    }
  }

  return state;
};

export default reducer;

export const getLog = (state: AppState) => getState(state).log;
