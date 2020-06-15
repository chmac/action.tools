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

    it('Creates a task list that matches expected markdown with one task #ARaqJE', async () => {
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
      ).toEqual(`- [ ] A task\n`);
    });
    it('Creates a task list that matches expected markdown with three tasks #LbIvfd', async () => {
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
              {
                id: 'example2',
                finished: true,
                sectionId: 'top',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'A completed task' }],
                  },
                ],
              },
              {
                id: 'example3',
                finished: false,
                sectionId: 'top',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Another task' }],
                  },
                ],
              },
            ],
          })
        )
      ).toEqual(`- [ ] A task\n- [x] A completed task\n- [ ] Another task\n`);
    });

    it('Creates a task list that matches expected markdown with two sections #3yh9IU', async () => {
      expect(
        await mdastToMarkdown(
          createMdast({
            sections: [
              { id: 'top', contents: [], depth: 0 },
              {
                id: 'h1',
                contents: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        value: 'A paragraph under the heading.',
                      },
                    ],
                  },
                ],
                depth: 1,
                heading: {
                  type: 'heading',
                  depth: 1,
                  children: [{ type: 'text', value: 'A top heading' }],
                },
              },
            ],
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
              {
                id: 'example2',
                finished: true,
                sectionId: 'top',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'A completed task' }],
                  },
                ],
              },
              {
                id: 'example3',
                finished: false,
                sectionId: 'top',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'Another task' }],
                  },
                ],
              },
              {
                id: 'example4',
                finished: false,
                sectionId: 'h1',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', value: 'A sectioned task' }],
                  },
                ],
              },
              {
                id: 'example5',
                finished: false,
                sectionId: 'h1',
                data: {},
                contents: [
                  {
                    type: 'paragraph',
                    children: [
                      { type: 'text', value: 'A second sectioned task' },
                    ],
                  },
                ],
              },
            ],
          })
        )
      ).toEqual(`- [ ] A task
- [x] A completed task
- [ ] Another task

# A top heading

A paragraph under the heading.

- [ ] A sectioned task
- [ ] A second sectioned task
`);
    });
  });
});
