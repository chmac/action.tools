import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { domdReduxKey, reducer as domdReducer } from "do.md";
import LeftMenu, {
  REDUX_KEY as LeftMenuKey,
} from "./scenes/LeftMenu/LeftMenu.state";
import Notifications, {
  REDUX_KEY as NotificationsKey,
} from "./scenes/Notifications/Notifications.state";
import TaskForm, {
  REDUX_KEY as TaskFormKey,
} from "./scenes/TaskForm/TaskForm.state";
import now, { REDUX_KEY as nowKey } from "./services/now/now.state";
import storage, {
  REDUX_KEY as storageKey,
} from "./services/storage/storage.state";

const reducer = combineReducers({
  [domdReduxKey]: domdReducer,
  [LeftMenuKey]: LeftMenu,
  [NotificationsKey]: Notifications,
  [TaskFormKey]: TaskForm,
  [nowKey]: now,
  [storageKey]: storage,
});

export type AppState = ReturnType<typeof reducer>;

const store = configureStore({
  reducer,
  devTools: true,
});

// Expose the store to the console, we want to be developer friendly so folks
// can easily poke about and see what's going on.
(globalThis as any).store = store;

export default store;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;
