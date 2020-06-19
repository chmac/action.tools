import {
  Notice,
  push as pushRedux,
} from "../../scenes/Notifications/Notifications.state";
import store from "../../store";

export type Message = {
  message: string;
  type: Notice["type"];
};

export const push = ({
  message,
  type = "info",
}: {
  message: string;
  type?: Notice["type"];
}) => {
  store.dispatch(pushRedux({ notice: { message, type } }));
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
