import {
  isSnoozed,
  isBlockedByAfterDate,
  isTaskActionableToday,
  isTaskActionableInCurrentContexts,
  doesTaskMatchDate,
  isTaskUndated,
} from './query.service';
import { EXCLUDED_BY_DEFAULT_CONTEXTS } from '../../constants';

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

  describe('', () => {
    it('Returns true for a matching context #6mwEJE', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: ['foo'],
          currentContexts: ['foo'],
        })
      ).toEqual(true);
    });

    it('Returns false when the context is present and not a match #uQguwz', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: ['foo'],
          currentContexts: ['bar', 'baz'],
        })
      ).toEqual(false);
    });

    it('Returns true for empty contexts #VPGVOG', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: [],
          currentContexts: ['foo'],
        })
      ).toEqual(true);
    });

    it('Returns false for an excluded context with empty currentContexts #JpyfT2', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: [EXCLUDED_BY_DEFAULT_CONTEXTS[0]],
          currentContexts: [],
        })
      ).toEqual(false);
    });

    it('Returns false for an excluded context with currentContexts #6VF5bW', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: [EXCLUDED_BY_DEFAULT_CONTEXTS[0]],
          currentContexts: ['foo'],
        })
      ).toEqual(false);
    });

    it('Returns true when an excluded context is explicitly enabled #oSJjlI', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: [EXCLUDED_BY_DEFAULT_CONTEXTS[0]],
          currentContexts: [EXCLUDED_BY_DEFAULT_CONTEXTS[0]],
        })
      ).toEqual(true);
    });

    it('Returns true when an excluded context is explicitly enabled with others #ffbB9c', () => {
      expect(
        isTaskActionableInCurrentContexts({
          contexts: [EXCLUDED_BY_DEFAULT_CONTEXTS[0]],
          currentContexts: ['foo', 'bar', EXCLUDED_BY_DEFAULT_CONTEXTS[0]],
        })
      ).toEqual(true);
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

    it('Returns true when task has empty string after date #5Em76z', () => {
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
              after: '',
            },
          },
          today,
          currentContexts: [],
        })
      ).toEqual(true);
    });

    it('Returns true when a task has empty string snooze date #rfjj4L', () => {
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
              snooze: '',
            },
          },
          today,
          currentContexts: [],
        })
      ).toEqual(true);
    });

    it('Returns true when a task has empty string after and snooze dates #MmuRqO', () => {
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
              after: '',
              snooze: '',
            },
          },
          today,
          currentContexts: [],
        })
      ).toEqual(true);
    });
  });

  describe('doesTaskMatchDate()', () => {
    it('Returns false for an empty string after date #sqdJr9', () => {
      expect(
        doesTaskMatchDate({
          task: {
            contentMarkdown: 'A task',
            finished: false,
            id: 'abc',
            isSequential: false,
            isTask: true,
            parentId: '',
            sectionId: 'h1',
            data: {
              after: '',
            },
          },
          date: today,
          currentContexts: [],
        })
      );
    });
  });

  describe('isTaskUndated()', () => {
    it('Returns true for a task without any dates #P26XBk', () => {
      expect(
        isTaskUndated({
          contentMarkdown: 'A task',
          finished: false,
          id: 'abc',
          isSequential: false,
          isTask: true,
          parentId: '',
          sectionId: 'h1',
          data: {},
        })
      ).toEqual(true);
    });

    it('Returns false for a task with an after date #HvuiTe', () => {
      expect(
        isTaskUndated({
          contentMarkdown: 'A task',
          finished: false,
          id: 'abc',
          isSequential: false,
          isTask: true,
          parentId: '',
          sectionId: 'h1',
          data: {
            after: yesterday,
          },
        })
      ).toEqual(false);
    });

    it('Returns false for a task with a by date #sItloG', () => {
      expect(
        isTaskUndated({
          contentMarkdown: 'A task',
          finished: false,
          id: 'abc',
          isSequential: false,
          isTask: true,
          parentId: '',
          sectionId: 'h1',
          data: {
            by: tomorrow,
          },
        })
      ).toEqual(false);
    });

    it('Returns false for a task with after and by dates #Ccm7kH', () => {
      expect(
        isTaskUndated({
          contentMarkdown: 'A task',
          finished: false,
          id: 'abc',
          isSequential: false,
          isTask: true,
          parentId: '',
          sectionId: 'h1',
          data: {
            after: yesterday,
            by: tomorrow,
          },
        })
      ).toEqual(false);
    });
  });
});
