import { snackbarService, MessageType } from "uno-material-ui";

import store from "../../store";
import { pushMessage } from "./notifications.state";

export type Message = {
  message: string;
  type: MessageType;
};
const stack: Message[] = [];

export const push = ({
  message,
  type = "info",
}: {
  message: string;
  type?: MessageType;
}) => {
  store.dispatch(pushMessage({ message, type }));
  stack.push({ message, type });
  snackbarService.showSnackbar(message, type);
};

export const pushError = ({
  error,
  message,
}: {
  message: string;
  error: Error;
}) => {
  push({ message: `${message}: ${error.message}`, type: "error" });
};
