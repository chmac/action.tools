import { mdastToMarkdown } from '../../__fixtures__/markdown.fixtures';
import { createMdast, serializeData } from './unparser.service';
import { AFTER, BY, KEY_VALUE_SEPARATOR } from '../../constants';

const yesterday = '2020-02-23';
const today = '2020-02-24';
const tomorrow = '2020-02-25';

describe('unparser', () => {
  describe('serializeData()', () => {
    it('Serializes #yy5H4E', () => {
      expect(serializeData({ id: 'foo', after: today })).toMatchSnapshot();
    });

    it('Returns empty array for no data #XF6duP', () => {
      expect(serializeData({})).toEqual([]);
    });

    it('Serializes in alphabetical order of key #rk1CK7', () => {
      expect(
        serializeData({
          id: 'foo',
          by: tomorrow,
          after: today,
        })
      ).toEqual([
        { type: 'break' },
        { type: 'inlineCode', value: `${AFTER}${KEY_VALUE_SEPARATOR}${today}` },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: `${BY}${KEY_VALUE_SEPARATOR}${tomorrow}` },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: 'id:foo' },
      ]);
    });

    it('Serializes one context as @context #vyGDhE', () => {
      expect(
        serializeData({
          contexts: ['foo'],
        })
      ).toEqual([{ type: 'break' }, { type: 'inlineCode', value: '@foo' }]);
    });

    it('Serializes multiple contexts as repeated @context #eFYIjV', () => {
      expect(
        serializeData({
          contexts: ['foo', 'bar', 'baz'],
        })
      ).toEqual([
        { type: 'break' },
        { type: 'inlineCode', value: '@foo' },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: '@bar' },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: '@baz' },
      ]);
    });

    it('Serializes in alphabetical order of key including contexts #weABSU', () => {
      expect(
        serializeData({
          id: 'foo',
          by: tomorrow,
          after: yesterday,
          contexts: ['foo', 'bar', 'baz'],
        })
      ).toEqual([
        { type: 'break' },
        {
          type: 'inlineCode',
          value: `${AFTER}${KEY_VALUE_SEPARATOR}${yesterday}`,
        },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: `${BY}${KEY_VALUE_SEPARATOR}${tomorrow}` },
        { type: 'text', value: ' ' },
        // NOTE: Contexts are inserted in alphabetical order of C for context
        { type: 'inlineCode', value: '@foo' },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: '@bar' },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: '@baz' },
        { type: 'text', value: ' ' },
        { type: 'inlineCode', value: 'id:foo' },
      ]);
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

    it('Creates an initial task list #73kagJ', () => {
      expect(
        createMdast({
          sections: [{ id: 'top', contents: [], depth: 0 }],
          tasks: [
            {
              id: 'example1',
              finished: false,
              sectionId: 'top',
              isSequential: false,
              isTask: true,
              parentId: '',
              data: {},
              contentMarkdown: 'A task',
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
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A task',
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
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A task',
              },
              {
                id: 'example2',
                finished: true,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A completed task',
              },
              {
                id: 'example3',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'Another task',
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
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A task',
              },
              {
                id: 'example2',
                finished: true,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A completed task',
              },
              {
                id: 'example3',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'Another task',
              },
              {
                id: 'example4',
                finished: false,
                sectionId: 'h1',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A sectioned task',
              },
              {
                id: 'example5',
                finished: false,
                sectionId: 'h1',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A second sectioned task',
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

    it('Creates a task list that matches the expected markdown with a nested list #XLbatC', async () => {
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
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A task',
              },
              {
                id: 'example2',
                finished: true,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A completed task',
              },
              {
                id: 'example21j',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: 'example2',
                isTask: true,
                data: {},
                contentMarkdown: 'A child task',
              },
              {
                id: 'example22',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: 'example2',
                isTask: true,
                data: {},
                contentMarkdown: 'Another child task',
              },
              {
                id: 'example3',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'Another top level task',
              },
              {
                id: 'example4',
                finished: false,
                sectionId: 'h1',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A sectioned task',
              },
              {
                id: 'example5',
                finished: false,
                sectionId: 'h1',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A second sectioned task',
              },
            ],
          })
        )
      ).toEqual(`- [ ] A task
- [x] A completed task
  - [ ] A child task
  - [ ] Another child task
- [ ] Another top level task

# A top heading

A paragraph under the heading.

- [ ] A sectioned task
- [ ] A second sectioned task
`);
    });
    it('Creates a task list that matches the expected markdown with non task list items', async () => {
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
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A task',
              },
              {
                id: 'example2',
                finished: true,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A completed task',
              },
              {
                id: 'example21j',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: 'example2',
                isTask: true,
                data: {},
                contentMarkdown: 'A child task',
              },
              {
                id: 'example22',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: 'example2',
                isTask: false,
                data: {},
                contentMarkdown: 'Another child task',
              },
              {
                id: 'example3',
                finished: false,
                sectionId: 'top',
                isSequential: false,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'Another top level task',
              },
              {
                id: 'example4',
                finished: false,
                sectionId: 'h1',
                isSequential: true,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A sectioned task',
              },
              {
                id: 'example5',
                finished: false,
                sectionId: 'h1',
                isSequential: true,
                parentId: '',
                isTask: true,
                data: {},
                contentMarkdown: 'A second sectioned task',
              },
            ],
          })
        )
      ).toEqual(`- [ ] A task
- [x] A completed task
  - [ ] A child task
  - Another child task
- [ ] Another top level task

# A top heading

A paragraph under the heading.

1. [ ] A sectioned task
1. [ ] A second sectioned task
`);
    });
  });
});
