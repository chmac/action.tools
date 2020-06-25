import { today } from '../../__fixtures__/markdown.fixtures';
import {
  calculateNextByAfterDates,
  calculateNextTaskId,
} from './repeat.service';
import { getRepeatParams } from './services/repeatParser/repeatParser.service';

// NOTE: There are other tests including mocks in repeat.service.mocks.test as
// the mocks interfere with other tests in this file.

describe('repeat.service', () => {
  describe('calculateNextTaskId()', () => {
    it('Adds -1 to the id when given a string without a dash #MlHkjs', () => {
      expect(calculateNextTaskId('foobar')).toEqual('foobar-1');
    });

    it('Adds -2 to an id ending -1 #peAVD3', () => {
      expect(calculateNextTaskId('foobar-1')).toEqual('foobar-2');
    });

    it('Adds -10 to an id ending -9 #cXmUuN', () => {
      expect(calculateNextTaskId('foobar-9')).toEqual('foobar-10');
    });

    it('Adds -100 to an id ending -99 #zENGsR', () => {
      expect(calculateNextTaskId('foobar-99')).toEqual('foobar-100');
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
          calculateNextByAfterDates({
            [dateType]: inputDate,
            today,
            repeat: getRepeatParams(repeatString),
          })
        ).toEqual({ [dateType]: expectedDate });
      }
    );

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
        '2020-04-01',
        '2020-05-28',
        'every3months',
      ],
      [
        '#aeeTEd',
        '2020-01-01',
        '2020-02-28', // Future
        '2020-03-28',
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
        '2020-04-01',
        '2020-05-10',
        'every3months',
      ],
      [
        '#Q5iS36',
        '2020-01-01',
        '2020-02-10', // Past
        '2020-04-15',
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
          calculateNextByAfterDates({
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

    /*
    it.skip('Always selects a date after the last date #6JzpMD', () => {
      const task = makeTask(
        'An example task last Monday repeating on Mondays',
        true,
        ['after:2020-02-19', 'repeat:everywed']
      );
      const expected = makeTask(
        'An example task last Monday repeating on Mondays',
        true,
        ['after:2020-02-26', 'repeat:everywed']
      );
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it.skip('Correctly skips today if today was the next iteration #xiw8x9', () => {
      const task = makeTask(
        'An example task last Monday repeating on Mondays',
        true,
        ['after:2020-02-17', 'repeat:everymon']
      );
      const expected = makeTask(
        'An example task last Monday repeating on Mondays',
        true,
        ['after:2020-03-02', 'repeat:everymon']
      );
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it.skip('Correctly calculates for after:2020-02-24 repeat:every3days without a by date #b3qWvU', () => {
      const task = makeTask('A simple task', true, [
        'after:2020-02-24',
        'repeat:every3days',
      ]);
      const expected = makeTask('A simple task', true, [
        'after:2020-02-27',
        'repeat:every3days',
      ]);
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it.skip('Correctly adds 1 month to both by and after dates #mVwp7v', () => {
      const task = makeTask('An example task', true, [
        'after:2020-02-10',
        'by:2020-02-20',
        'repeat:every1month',
      ]);
      const expected = makeTask('An example task', true, [
        'after:2020-03-10',
        'by:2020-03-20',
        'repeat:every1month',
      ]);
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it.skip('Correctly adds 3 years to by and after dates #DYtXLy', () => {
      const task = makeTask('An example task', true, [
        'after:2020-02-10',
        'by:2020-02-20',
        'repeat:every3year',
      ]);
      const expected = makeTask('An example task', true, [
        'after:2023-02-10',
        'by:2023-02-20',
        'repeat:every3year',
      ]);
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it('Throws for a task without an after or by date #Ntbyrc', () => {
      const task = makeTask('An example without a date', false, [
        'repeat:every3days',
      ]);
      expect(() => setNextByAndAfterDates(task, today)).toThrow();
    });
    */
  });

  /*
  describe.skip('calculateNextIteration()', () => {
    it('Correctly calculates for by:2020-02-21 repeat:after3days #b2mYm5', () => {
      const task = makeTask('A simple task', true, [
        'by:2020-02-21',
        'repeat:after3days',
      ]);
      const expected = makeTask('A simple task', false, [
        'by:2020-02-27',
        'repeat:after3days',
      ]);
      expect(createNextRepetitionTask(task, today)).toEqual(expected);
    });

    it('Correctly calculates for by:2020-02-24 repeat:every3days #7jfVa5', () => {
      const task = makeTask('A simple task', true, [
        'by:2020-02-24',
        'repeat:every3days',
      ]);
      const expected = makeTask('A simple task', false, [
        'by:2020-02-27',
        'repeat:every3days',
      ]);
      expect(createNextRepetitionTask(task, today)).toEqual(expected);
    });

    it('Removes the finished field #HFcU0o', () => {
      const task = makeTask('A simple task', true, [
        'by:2020-02-21',
        'repeat:after3days',
        'finished:2020-02-24',
      ]);
      const expected = makeTask('A simple task', false, [
        'by:2020-02-27',
        'repeat:after3days',
      ]);
      expect(createNextRepetitionTask(task, today)).toEqual(expected);
    });
  });
  */
});
