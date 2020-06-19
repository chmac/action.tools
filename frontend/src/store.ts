import {
  combineReducers,
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { domdReduxKey, reducer as domdReducer } from "do.md";
import now, { REDUX_KEY as nowKey } from "./services/now/now.state";
import storage, {
  REDUX_KEY as storageKey,
} from "./services/storage/storage.state";
import LeftMenu, {
  REDUX_KEY as LeftMenuKey,
} from "./scenes/LeftMenu/LeftMenu.state";
import Notifications, {
  REDUX_KEY as NotificationsKey,
} from "./scenes/Notifications/Notifications.state";

const reducer = combineReducers({
  [domdReduxKey]: domdReducer,
  [nowKey]: now,
  [storageKey]: storage,
  [LeftMenuKey]: LeftMenu,
  [NotificationsKey]: Notifications,
});

export type AppState = ReturnType<typeof reducer>;

const store = configureStore({
  reducer,
  devTools: true,
});

export default store;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;
