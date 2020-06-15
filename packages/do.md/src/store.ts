import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import devToolsEnhancer, {
  RemoteReduxDevToolsOptions,
} from 'remote-redux-devtools';
import { REDUX_ROOT_KEY } from './constants';

const empty: { empty: boolean } = { empty: true };

export const reducer = (state = empty) => state;

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

// export type RootState = ReturnType<typeof store.getState>;
export type RootState = {
  [REDUX_ROOT_KEY]: ReturnType<typeof reducer>;
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
