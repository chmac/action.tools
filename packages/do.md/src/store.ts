import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import devToolsEnhancer, {
  RemoteReduxDevToolsOptions,
} from 'remote-redux-devtools';
import { REDUX_ROOT_KEY } from './constants';
import data, { REDUX_KEY as dataKey } from './services/data/data.state';
import query, { REDUX_KEY as queryKey } from './services/query/query.state';
import startup, {
  REDUX_KEY as startupKey,
} from './services/startup/startup.state';

export const reducer = combineReducers({
  [startupKey]: startup,
  [dataKey]: data,
  [queryKey]: query,
});

export const createStore = (args?: {
  enableDevTools?: boolean;
  enableRemoteDevTools?: boolean;
  devToolsEnhancerArgs?: RemoteReduxDevToolsOptions;
}) => {
  const {
    enableDevTools = false,
    enableRemoteDevTools = true,
    devToolsEnhancerArgs = {
      hostname: 'localhost',
      port: 8000,
      realtime: true,
    },
  } = typeof args === 'undefined' ? {} : args;

  const enhancers = [];
  if (enableRemoteDevTools) {
    enhancers.push(devToolsEnhancer(devToolsEnhancerArgs));
  }

  const store = configureStore({
    reducer: {
      [REDUX_ROOT_KEY]: reducer,
    },
    devTools: enableDevTools,
    enhancers,
  });

  return store;
};

export type LocalState = ReturnType<typeof reducer>;

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = {
  [REDUX_ROOT_KEY]: LocalState;
};
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

/**
 * Get the state for this package from a top level redux store
 */
export const getLocalState = (state: RootState) => state[REDUX_ROOT_KEY];
