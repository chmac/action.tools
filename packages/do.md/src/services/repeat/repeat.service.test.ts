import { Task } from '../../types';
import { today } from '../../__fixtures__/markdown.fixtures';
import {
  _calculateNextByAfterDates,
  _calculateNextTaskId,
  createNextIteration,
} from './repeat.service';
import { getRepeatParams } from './services/repeatParser/repeatParser.service';

// NOTE: There are other tests including mocks in repeat.service.mocks.test as
// the mocks interfere with other tests in this file.

describe('repeat.service', () => {
  describe('calculateNextTaskId()', () => {
    it('Adds -1 to the id when given a string without a dash #MlHkjs', () => {
      expect(_calculateNextTaskId('foobar')).toEqual('foobar-1');
    });

    it('Adds -2 to an id ending -1 #peAVD3', () => {
      expect(_calculateNextTaskId('foobar-1')).toEqual('foobar-2');
    });

    it('Adds -10 to an id ending -9 #cXmUuN', () => {
      expect(_calculateNextTaskId('foobar-9')).toEqual('foobar-10');
    });

    it('Adds -100 to an id ending -99 #zENGsR', () => {
      expect(_calculateNextTaskId('foobar-99')).toEqual('foobar-100');
    });
  });

  describe('calculateNextByAfterDates()', () => {
    it.each([
      ['#AWxyMB', 'by', '2020-02-21', '2020-02-27', 'after3days'],
      ['#nbgEST', 'after', '2020-02-21', '2020-02-27', 'after3days'],
      ['#4Of7Th', 'by', '2020-02-10', '2020-02-27', 'after3days'],
      ['#DMACIr', 'after', '2020-02-10', '2020-02-27', 'after3days'],
      ['#KdO06E', 'by', '2020-02-24', '2020-02-27', 'after3days'],
      ['#Mqx3Nf', 'after', '2020-02-24', '2020-02-27', 'after3days'],
      ['#KD5WiY', 'by', '2020-01-01', '2020-04-01', 'every3months'],
      ['#BRu46f', 'after', '2020-01-01', '2020-04-01', 'every3months'],
      ['#lfBQzl', 'by', '2020-01-01', '2020-05-24', 'after3months'],
      ['#tcCxTc', 'after', '2020-01-01', '2020-05-24', 'after3months'],
      ['#AcUeUe', 'by', '2020-04-01', '2020-07-01', 'every3months'],
      ['#ptYUcG', 'after', '2020-04-01', '2020-07-01', 'every3months'],
      ['#R4QTE0', 'by', '2020-07-01', '2020-10-01', 'every3months'],
      ['#MsO9WQ', 'after', '2020-07-01', '2020-10-01', 'every3months'],
    ])(
      'single date %s type %s start %s expected %s repeat %s #oVCcNv',
      (_, dateType, inputDate, expectedDate, repeatString) => {
        expect(
          _calculateNextByAfterDates({
            [dateType]: inputDate,
            today,
            repeat: getRepeatParams(repeatString),
          })
        ).toEqual({ [dateType]: expectedDate });
      }
    );

    /**
     * NOTES
     *
     * When calculating the time between 1 Jan and 28 Feb, there are 2 ways to
     * consider the problem. JS-Joda uses an algorithm based on human
     * perception of "months", so it calculates 1 month and 27 days. While
     * dayjs takes a "minute" view, and so it calculates 58 days.
     *
     * Now repeating for 1 Apr to 28 May, JS-Joda produces the same, 1 month
     * and 27 days. While dayjs calculates this duration as 57 days.
     *
     * Note that January has 31 days while April has only 30.
     *
     * In theory, we could implement the JS-Joda approach (which likely makes
     * more intuitive sense to a human observer), but for now, we're just
     * amending the tests.
     */

    it.each([
      [
        '#OeDSVL',
        '2020-02-12', // After a week past Wednesday
        '2020-02-14', // By a week past Friday
        '2020-02-26', // This Wednesday
        '2020-02-28', // This Friday
        'every1week',
      ],
      [
        '#RVE3BG',
        '2020-02-12', // After a week past Wednesday
        '2020-02-14', // By a week past Friday
        '2020-02-29', // One week minus 2 days from today
        '2020-03-02', // One week from today
        'after1week',
      ],
      [
        '#pIAGl2',
        '2020-01-01',
        '2020-02-28', // Future
        // '2020-04-01', // This relies on js-joda math
        '2020-03-31',
        '2020-05-28',
        'every3months',
      ],
      [
        '#aeeTEd',
        '2020-01-01',
        '2020-02-28', // Future
        // '2020-03-28', // This relies on js-joda math
        '2020-03-27',
        '2020-05-24',
        'after3months',
      ],
      [
        '#zo6wo9',
        '2020-01-01',
        '2020-01-07', // Past
        '2020-04-01',
        '2020-04-07',
        'every3months',
      ],
      [
        '#W57lTF',
        '2020-01-01',
        '2020-01-07', // Past
        '2020-05-18',
        '2020-05-24',
        'after3months',
      ],
      [
        '#j5DsWo',
        '2020-01-01',
        '2020-02-10', // Past
        // '2020-04-01', // This relies on js-joda math
        '2020-03-31',
        '2020-05-10',
        'every3months',
      ],
      [
        '#Q5iS36',
        '2020-01-01',
        '2020-02-10', // Past
        // '2020-04-15', // This relies on js-joda math
        '2020-04-14',
        '2020-05-24',
        'after3months',
      ],
    ])(
      'by and after dates %s (after: %s, by: %s) (after: %s, by: %s) repeat: %s #oVCcNv',
      (
        _,
        afterInputDate,
        byInputDate,
        afterExpectedDate,
        byExpectedDate,
        repeatString
      ) => {
        expect(
          _calculateNextByAfterDates({
            by: byInputDate,
            after: afterInputDate,
            today,
            repeat: getRepeatParams(repeatString),
          })
        ).toEqual({
          after: afterExpectedDate,
          by: byExpectedDate,
        });
      }
    );

    it('Always selects a date after the last date #6JzpMD', () => {
      expect(
        _calculateNextByAfterDates({
          after: '2020-02-19',
          today,
          repeat: getRepeatParams('everywed'),
        })
      ).toEqual({ after: '2020-02-26' });
    });

    it('Correctly skips today if today was the next iteration #xiw8x9', () => {
      expect(
        _calculateNextByAfterDates({
          after: '2020-02-17',
          today,
          repeat: getRepeatParams('everymon'),
        })
      ).toEqual({ after: '2020-03-02' });
    });

    it('Correctly calculates for after:2020-02-24 repeat:every3days without a by date #b3qWvU', () => {
      expect(
        _calculateNextByAfterDates({
          after: '2020-02-24',
          today,
          repeat: getRepeatParams('every3days'),
        })
      ).toEqual({ after: '2020-02-27' });
    });

    it('Correctly adds 1 month to both by and after dates #mVwp7v', () => {
      expect(
        _calculateNextByAfterDates({
          after: '2020-02-10',
          by: '2020-02-20',
          repeat: getRepeatParams('every1month'),
          today,
        })
      ).toEqual({
        after: '2020-03-10',
        by: '2020-03-20',
      });
    });

    it('Correctly adds 3 years to by and after dates #DYtXLy', () => {
      expect(
        _calculateNextByAfterDates({
          after: '2020-02-10',
          by: '2020-02-20',
          repeat: getRepeatParams('every3year'),
          today,
        })
      ).toEqual({
        after: '2023-02-10',
        by: '2023-02-20',
      });
    });
  });

  describe('createNextIteration()', () => {
    it('Correctly calculates for by:2020-02-21 repeat:after3days #b2mYm5', () => {
      const task: Task = {
        id: 'abc123',
        contentMarkdown: 'A simple task',
        finished: true,
        isSequential: false,
        isTask: true,
        parentId: '',
        sectionId: 'top',
        data: {
          id: 'abc123',
          by: '2020-02-21',
          repeat: 'after3days',
        },
      };

      expect(createNextIteration({ task, today })).toEqual({
        ...task,
        id: 'abc123-1',
        finished: false,
        data: {
          id: 'abc123-1',
          created: today,
          by: '2020-02-27',
          repeat: 'after3days',
        },
      });
    });

    it('Correctly calculates for by:2020-02-24 repeat:every3days #7jfVa5', () => {
      const task: Task = {
        id: 'abc123',
        contentMarkdown: 'A simple task',
        finished: true,
        isSequential: false,
        isTask: true,
        parentId: '',
        sectionId: 'top',
        data: {
          id: 'abc123',
          by: '2020-02-24',
          repeat: 'every3days',
        },
      };
      expect(createNextIteration({ task, today })).toEqual({
        ...task,
        id: 'abc123-1',
        finished: false,
        data: {
          id: 'abc123-1',
          created: today,
          by: '2020-02-27',
          repeat: 'every3days',
        },
      });
    });

    it('Removes the finished field #HFcU0o', () => {
      const task: Task = {
        id: 'abc123',
        contentMarkdown: 'A simple task',
        finished: true,
        isSequential: false,
        isTask: true,
        parentId: '',
        sectionId: 'top',
        data: {
          id: 'abc123',
          by: '2020-02-21',
          finished: today,
          repeat: 'after3days',
        },
      };

      expect(createNextIteration({ task, today })).toEqual({
        ...task,
        id: 'abc123-1',
        finished: false,
        data: {
          id: 'abc123-1',
          created: today,
          by: '2020-02-27',
          repeat: 'after3days',
        },
      });
    });
  });
});
