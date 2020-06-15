import { createStore } from '../../store';
import { startup } from './actions/startup.action';

export const startWithLocalStore = async () => {
  const store = createStore();
  await store.dispatch(startup());

  return store;
};

if (process.env.NODE_ENV === 'development') {
  if (typeof process.env.BOOT_LOCAL_STORE === 'string') {
    console.log('Starting with local store #Z2YeZJ');

    const run = async () => {
      await startWithLocalStore();
    };

    run();
  } else {
    console.log('No local store startup #tmtthO');
  }
}
