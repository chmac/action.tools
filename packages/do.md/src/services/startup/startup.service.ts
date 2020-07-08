import fs from 'fs';
import { join } from 'path';
import { createStore } from '../../store';
import { startup } from './actions/startup.action';

export const startWithLocalStore = async ({
  markdown,
}: {
  markdown: string;
}) => {
  const store = createStore();
  await store.dispatch(startup({ markdown }));

  return store;
};

if (process.env.NODE_ENV === 'development') {
  if (typeof process.env.BOOT_LOCAL_STORE === 'string') {
    console.log('Starting with local store #Z2YeZJ');

    const run = async () => {
      try {
        const markdown = await fs.promises.readFile(
          join(__dirname, '../src/__fixtures__/do.md'),
          { encoding: 'utf8' }
        );
        await startWithLocalStore({ markdown });
      } catch (error) {
        console.error('Startup error #guDBki', error);
      }
    };

    run();
  } else {
    console.log('No local store startup #tmtthO');
  }
}
