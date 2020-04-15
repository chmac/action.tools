import { snackbarService, MessageType } from "uno-material-ui";

export const push = ({
  message,
  type = "info",
}: {
  message: string;
  type?: MessageType;
}) => {
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
