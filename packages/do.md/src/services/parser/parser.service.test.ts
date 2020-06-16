import { List } from 'mdast';
import {
  complexTaskListMarkdown,
  getFirstTaskFromMdast,
  markdownToMdast,
  taskListOnlyMarkdown,
  tasksWithSecondLineMarkdown,
} from '../../__fixtures__/markdown.fixtures';
import {
  getDataFromListItem,
  getTextFromListItem,
  listToTasks,
  parseMdast,
} from './parser.service';

describe('parser', () => {
  // We test the fixtures to ensure that as we upgrade / swap the packages that
  // convert text to mdast and back, they don't introduce changes.
  describe('fixtures', () => {
    it('Fixtures remain consistent', () => {
      expect(markdownToMdast(taskListOnlyMarkdown)).toMatchSnapshot();
      expect(markdownToMdast(tasksWithSecondLineMarkdown)).toMatchSnapshot();
      expect(markdownToMdast(`- [ ] # Can we heading?`)).toMatchSnapshot();
      expect(
        markdownToMdast(`- [ ] # Will a heading fit here?  
  
  Multiple paras?`)
      ).toMatchSnapshot();
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

  describe('getDataFromListItem()', () => {
    it('Returns empty object for task with no data #szIeqo', () => {
      expect(
        getDataFromListItem(
          getFirstTaskFromMdast(
            markdownToMdast(`- [ ] A simple task without any data`)
          )
        )
      ).toEqual({});
    });

    it('Fetches data correctly #szIeqo', () => {
      expect(
        getDataFromListItem(
          getFirstTaskFromMdast(
            markdownToMdast(
              '- [ ] A simple task without any data `after:2020-02-01` `by:2020-02-24` `id:def12`'
            )
          )
        )
      ).toEqual({
        after: '2020-02-01',
        by: '2020-02-24',
        id: 'def12',
      });
    });
  });

  describe('listToTasks()', () => {
    it('Generates tasks #HetQot', () => {
      const root = markdownToMdast(taskListOnlyMarkdown);
      expect(listToTasks(root.children[0] as List)).toMatchSnapshot();
    });
  });

  describe('parseMdast()', () => {
    it('Generates sections with tasks #otm70r', () => {
      // NOTE: This snapshot is so we have a record of the input as well as the
      // expected output
      expect(markdownToMdast(complexTaskListMarkdown)).toMatchSnapshot();
      expect(
        parseMdast(markdownToMdast(complexTaskListMarkdown))
      ).toMatchSnapshot();
    });

    it('debugging #gVI0DY', () => {
      // This makes the snapshots a bit easier to see, huge mdast trees make it
      // hard to see what's going on otherwise.
      const sections = parseMdast(markdownToMdast(complexTaskListMarkdown));
      const sectionDeets = sections.map(section => ({
        id: section.id,
        heading: section.heading?.children[0],
        taskCount: section.tasks.length,
      }));
      expect(sectionDeets).toMatchSnapshot();
    });
  });
});
