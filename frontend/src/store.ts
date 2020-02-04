import thunkMiddleware from "redux-thunk";
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  AnyAction
} from "redux";

const empty = (state = { empty: true }, action: AnyAction) => state;

const reducer = combineReducers({
  empty
});

export type AppState = ReturnType<typeof reducer>;

const composeEnhancers =
  typeof window === "object" &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
