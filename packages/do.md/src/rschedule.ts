// NOTE: We need to install the utc plugin BEFORE rschedule, otherwise it
// complains and throws an Error on startup.
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import '@rschedule/dayjs-date-adapter/setup';

export * from '@rschedule/dayjs-date-adapter';
export * from '@rschedule/core';
// NOTE: This is required to somehow fix the exports, otherwise we end up with
// `import { Rule } from '@rschedule/dayjs-date-adapter'` in the built esm
// module. Unclear why, this is a hack but seems to work. Rollup maybe.
export { Rule } from '@rschedule/core/generators';
export * from '@rschedule/core/generators';
