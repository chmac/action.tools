import { snackbarService } from "uno-material-ui";

// TODO Hopefully this can be imported from `uno-material-ui`
// https://github.com/unosquare/uno-material-ui/pull/294
type MessageType = "success" | "error" | "warning" | "info";

type Message = {
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
