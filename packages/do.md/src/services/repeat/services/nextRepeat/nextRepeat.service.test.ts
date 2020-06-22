import dayjs from 'dayjs';
import { advanceTo, clear } from 'jest-date-mock';
import { TaskData, TaskListItem } from '../../../../types';
import { today, tomorrow } from '../../../../__fixtures__/markdown.fixtures';
import { serializeData } from '../../../unparser/unparser.service';
import {
  nextDateOfIteration,
  nextDateOfIterationAfterToday,
  nextDateOfIterationMonthly,
  nextDateOfIterationSimple,
  nextDateOfIterationWeekly,
} from './nextRepeat.service';

export const makeTask = (
  title: string,
  completed = false,
  fields?: string[]
): TaskListItem => {
  return {
    type: 'listItem',
    checked: completed,
    spread: false,
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: title },
          ...serializeData(fields as TaskData),
        ],
      },
    ],
  };
};

describe('calculateNextIteration', () => {
  beforeAll(() => {
    advanceTo(new Date(2020, 1, 24));
  });
  afterAll(() => {
    clear();
  });

  describe('nextDateOfIterationSimple', () => {
    it('Correctly adds 3 days #WMSXx4', () => {
      expect(
        nextDateOfIterationSimple({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 3,
            unit: 'day',
          },
          start: dayjs('2020-02-13'),
        })
      ).toEqual(dayjs('2020-02-16'));
    });

    it('Correctly adds 3 weeks #lQ7FGF', () => {
      expect(
        nextDateOfIterationSimple({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 3,
            unit: 'week',
          },
          start: dayjs('2020-02-13'),
        })
      ).toEqual(dayjs('2020-03-05'));
    });

    it('Correctly adds 3 months #hzNOWI', () => {
      expect(
        nextDateOfIterationSimple({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 3,
            unit: 'month',
          },
          // NOTE: This is a leap year
          start: dayjs('2020-02-13'),
        })
      ).toEqual(dayjs('2020-05-13'));
    });

    it('Correctly adds 3 years #itMM7s', () => {
      expect(
        nextDateOfIterationSimple({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 3,
            unit: 'year',
          },
          // NOTE: This is a leap year
          start: dayjs('2020-02-13'),
        })
      ).toEqual(dayjs('2023-02-13'));
    });
  });

  describe('nextDateOfIterationWeekly()', () => {
    it('Correctly calculates next mo,we #GBtSq5', () => {
      expect(
        nextDateOfIterationWeekly({
          repeat: {
            type: 'weekly',
            repeat: 'every',
            days: ['MO', 'WE'],
            count: 1,
          },
          start: dayjs('2020-02-13'),
        })
      ).toEqual(dayjs('2020-02-17'));
    });
  });

  describe('nextDateOfIterationMonthly()', () => {
    it('Correctly calculates next 1,4,19,22 of jan,apr,jul #NNds2c', () => {
      expect(
        nextDateOfIterationMonthly({
          repeat: {
            type: 'monthly',
            repeat: 'every',
            dates: [1, 4, 19, 22],
            months: [1, 4, 7, 10],
          },
          start: dayjs('2020-02-13'),
        })
      ).toEqual(dayjs('2020-04-01'));
    });
  });

  describe('nextDateOfIteration()', () => {
    it('Calculates a date in the past #oaeFNf', () => {
      expect(
        nextDateOfIteration({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 1,
            unit: 'day',
          },
          start: '2020-01-01',
        })
      ).toEqual('2020-01-02');
    });
  });

  describe('nextDateOfIterationAfterToday()', () => {
    it('Finds a date in the future #98vsou', () => {
      expect(
        nextDateOfIterationAfterToday({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 1,
            unit: 'day',
          },
          start: '2020-01-01',
          today,
        })
      ).toEqual(tomorrow);
    });

    it('Adds 1 month to a by date 10 days in teh past #Mm433A', () => {
      expect(
        nextDateOfIterationAfterToday({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 1,
            unit: 'month',
          },
          start: '2020-02-14',
          today,
        })
      ).toEqual('2020-03-14');
    });

    it('Adds 2 months to a by date 1 month and 10 days in the past #wu73J7', () => {
      expect(
        nextDateOfIterationAfterToday({
          repeat: {
            type: 'simple',
            repeat: 'every',
            count: 1,
            unit: 'month',
          },
          start: '2020-01-14',
          today,
        })
      ).toEqual('2020-03-14');
    });
  });
});
