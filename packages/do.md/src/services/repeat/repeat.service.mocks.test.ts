import { createId } from '../../utils';
import { _calculateNextTaskId } from './repeat.service';

/**
 * NOTES
 *
 * I was unable to figure out how to unmock the module, and the mock doesn't
 * implement all of the exports, so other tests in the same file would fail. In
 * the end, I moved these tests to a separate file so that the mocks don't
 * interfere with other tests.
 *
 * It may not be possible to mix mocked / unmocked moduels,
 */

const MOCK_ID = 'abc123';

jest.mock('../../utils', () => {
  return {
    createId: jest.fn(() => MOCK_ID),
  };
});

describe('repeat.service', () => {
  describe('calculateNextTaskId()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('Calls createId without an ID #9We4qV', () => {
      expect(jest.isMockFunction(createId)).toEqual(true);
      expect(_calculateNextTaskId()).toEqual(MOCK_ID);
      expect(createId).toHaveBeenCalledTimes(1);
      expect(createId).toHaveBeenCalledWith();
    });

    it('Does not call createId when given an id #9XNeDe', () => {
      expect(_calculateNextTaskId('foobar')).toEqual('foobar-1');
      expect(createId).not.toHaveBeenCalled();
    });
  });
});
