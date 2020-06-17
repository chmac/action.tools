import {
  isSnoozed,
  isBlockedByAfterDate,
  isTaskActionableToday,
} from './query.service';

const yesterday = '2020-02-23';
const today = '2020-02-24';
const tomorrow = '2020-02-25';

describe('query.service', () => {
  describe('isSnoozed()', () => {
    it('Returns false when snooze date is yesterday #sDisn2', () => {
      expect(isSnoozed({ snooze: yesterday, today })).toEqual(false);
    });

    it('Returns false when snooze date is today #kSO4mb', () => {
      expect(isSnoozed({ snooze: today, today })).toEqual(false);
    });

    it('Returns true when snooze date is tomorrow #S1mjjs', () => {
      expect(isSnoozed({ snooze: tomorrow, today })).toEqual(true);
    });
  });

  describe('isBlockedByAfterDate()', () => {
    it('Returns false when after date is yesterday #s7m8uN', () => {
      expect(isBlockedByAfterDate({ after: yesterday, today })).toEqual(false);
    });

    it('Returns false when after date is today #ZlFkgL', () => {
      expect(isBlockedByAfterDate({ after: today, today })).toEqual(false);
    });

    it('Returns true when after date is tomorrow #Y8oIw6', () => {
      expect(isBlockedByAfterDate({ after: tomorrow, today })).toEqual(true);
    });
  });

  describe('isTaskActionableToday()', () => {
    it('Returns false when a task is snoozed #APHTMa', () => {
      expect(
        isTaskActionableToday({
          task: {
            contentMarkdown: 'A task',
            finished: false,
            id: 'abc',
            isSequential: false,
            isTask: true,
            parentId: '',
            sectionId: 'h1',
            data: {
              snooze: tomorrow,
            },
          },
          today,
          currentContexts: [],
        })
      ).toEqual(false);
    });

    it('Returns false when a task is after tomorrow #5lzLr7', () => {
      expect(
        isTaskActionableToday({
          task: {
            contentMarkdown: 'A task',
            finished: false,
            id: 'abc',
            isSequential: false,
            isTask: true,
            parentId: '',
            sectionId: 'h1',
            data: {
              after: tomorrow,
            },
          },
          today,
          currentContexts: [],
        })
      ).toEqual(false);
    });

    it('Returns false when a task is finished #VCd2yR', () => {
      expect(
        isTaskActionableToday({
          task: {
            contentMarkdown: 'A task',
            finished: true,
            id: 'abc',
            isSequential: false,
            isTask: true,
            parentId: '',
            sectionId: 'h1',
            data: {},
          },
          today,
          currentContexts: [],
        })
      ).toEqual(false);
    });

    it('Returns true when a task is undated and without context #APHTMa', () => {
      expect(
        isTaskActionableToday({
          task: {
            contentMarkdown: 'A task',
            finished: false,
            id: 'abc',
            isSequential: false,
            isTask: true,
            parentId: '',
            sectionId: 'h1',
            data: {},
          },
          today,
          currentContexts: [],
        })
      ).toEqual(true);
    });
  });
});
