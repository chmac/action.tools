import { List } from 'mdast';
import {
  getFirstTaskFromMdast,
  markdownToMdast,
  taskListOnly,
  tasksWithSecondLine,
} from '../../__fixtures__/markdown.fixtures';
import { getTextFromListItem, listToTasks } from './parser.service';

describe('parser', () => {
  describe('fixtures', () => {
    it('Fixtures remain consistent', () => {
      expect(markdownToMdast(taskListOnly)).toMatchSnapshot();
      expect(markdownToMdast(tasksWithSecondLine)).toMatchSnapshot();
    });
  });

  describe('getTextFromListItem()', () => {
    it('Gets text from a simple task #ERa2eO', () => {
      const item = getFirstTaskFromMdast(
        markdownToMdast(`- [ ] A simple task`)
      );

      expect(getTextFromListItem(item)).toEqual('A simple task');
    });

    it('Gets text from a task with 2 lines #0yybP5', () => {
      const item = getFirstTaskFromMdast(
        markdownToMdast(`- [ ] A second line task  \nWith a second line`)
      );

      expect(getTextFromListItem(item)).toEqual(
        `A second line task\nWith a second line`
      );
    });

    it('Gets text from a task with 2 lines and inline code #6Bf3LC', () => {
      const item = getFirstTaskFromMdast(
        markdownToMdast(
          '- [ ] A second line task  \nWith a second line and a by date `by:2020-02-24`'
        )
      );

      expect(getTextFromListItem(item)).toEqual(
        `A second line task\nWith a second line and a by date`
      );
    });
  });

  describe('listToTasks()', () => {
    it('Converts #HetQot', () => {
      const root = markdownToMdast(taskListOnly);
      expect(listToTasks(root.children[0] as List)).toMatchSnapshot();
    });
  });
});
