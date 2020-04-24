import { AppState } from "../../store";
import { Message } from "./notifications.service";
import { Action } from "redux";

const getState = (state: AppState) => state.notifications;

const PUSH_MESSAGE = `app/notifications/PUSH_MESSAGE`;
interface PushMessageAction extends Action<typeof PUSH_MESSAGE> {
  payload: {
    message: Message;
  };
}
export const pushMessage = (message: Message): PushMessageAction => {
  return {
    type: PUSH_MESSAGE,
    payload: {
      message,
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
  messages: Message[];
};

const empty = {
  messages: [],
};

const reducer = (state: State = empty, action: NotificationActions): State => {
  switch (action.type) {
    case PUSH_MESSAGE: {
      console.log(action);
      return {
        ...state,
        messages: state.messages.concat(action.payload.message),
      };
    }

    case RESET: {
      return empty;
    }
  }

  return state;
};

export default reducer;
