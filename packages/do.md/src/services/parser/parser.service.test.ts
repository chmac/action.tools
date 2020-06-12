import { describe, it, expect } from 'jest-without-globals';
import {
  markdownToMdast,
  taskListOnly,
} from '../../__fixtures__/markdown.fixtures';

describe('parser', () => {
  describe('fixtures', () => {
    it('Fixtures remain consistent', () => {
      expect(markdownToMdast(taskListOnly)).toMatchSnapshot();
    });
  });
});
