import { LocalDate } from '@js-joda/core';
import { mdastToMarkdown } from '../../__fixtures__/markdown.fixtures';
import { createMdast, serializeData } from './unparser.service';

describe('unparser', () => {
  describe('serializeData()', () => {
    it('Serializes #yy5H4E', () => {
      expect(
        serializeData({ id: 'foo', after: LocalDate.of(2020, 2, 24) })
      ).toMatchSnapshot();
    });

    it('Returns empty array for no data #XF6duP', () => {
      expect(serializeData({})).toEqual([]);
    });
  });

  describe('createMdast()', () => {
    it('Creates an empty root without content #kLjEzn', () => {
      expect(
        createMdast({
          sections: [{ id: 'top', contents: [], depth: 0 }],
          tasks: [],
        })
      ).toMatchSnapshot();
    });

    it('Creates an initial task list #kLjEzn', () => {
      expect(
        createMdast({
          sections: [{ id: 'top', contents: [], depth: 0 }],
          tasks: [
            {
              id: 'example1',
              finished: false,
              sectionId: 'top',
              data: {},
              contents: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', value: 'A task' }],
                },
              ],
            },
          ],
        })
      ).toMatchSnapshot();
    });

    it('Creates a task list that matches expected markdown #ARaqJE', async () => {
      expect(
        await mdastToMarkdown(
          createMdast({
            sections: [{ id: 'top', contents: [], depth: 0 }],
            tasks: [
              {
                id: 'example1',
                finished: false,
                sectionId: 'top',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'A task' }],
                  },
                ],
              },
            ],
          })
        )
      ).toMatchSnapshot();
    });
  });
});
