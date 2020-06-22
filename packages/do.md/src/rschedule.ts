// NOTE: We need to install the utc plugin BEFORE rschedule, otherwise it
// complains and throws an Error on startup.
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import '@rschedule/dayjs-date-adapter/setup';

export * from '@rschedule/dayjs-date-adapter';
export * from '@rschedule/core';
export * from '@rschedule/core/generators';
