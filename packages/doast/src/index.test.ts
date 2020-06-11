import { describe, expect, it } from 'jest-without-globals';
import { Root } from 'mdast';
import u from 'unist-builder';
import { nestContentsInsideHeadings, mdastToDoast } from './index';

describe('index', () => {
  describe('nestContentsInsideHeadings()', () => {
    it('Has no effect without any headings #XXuslk', () => {
      const input = u('root', [
        u('paragraph', u('text', 'This is a first paragraph.')),
        u('paragraph', u('text', 'This is the second para.')),
      ]);
      const output = u('root', [
        u('paragraph', u('text', 'This is a first paragraph.')),
        u('paragraph', u('text', 'This is the second para.')),
      ]);

      expect(nestContentsInsideHeadings(input)).toEqual(output);
    });

    it('Makes everything a child of a single first heading #XvQpBo', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
        ]),
      ]);

      expect(nestContentsInsideHeadings(input as Root)).toEqual(output);
    });

    it('Creates 2 h1 and nests everything inside #nAXNlJ', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
        u('heading', { depth: 1 }, [u('text', 'A second top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the second heading.'),
        ]),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
        ]),
        u(
          'heading',
          { depth: 1, contents: [u('text', 'A second top heading')] },
          [
            u('paragraph', [
              u('text', 'This is a paragraph under the second heading.'),
            ]),
          ]
        ),
      ]);

      expect(nestContentsInsideHeadings(input as Root)).toEqual(output);
    });
  });

  describe('mdastToDoast()', () => {
    it('Has no effect without any headings #shoTh4', () => {
      const input = u('root', [
        u('paragraph', u('text', 'This is a first paragraph.')),
        u('paragraph', u('text', 'This is the second para.')),
      ]);
      const output = u('root', [
        u('paragraph', u('text', 'This is a first paragraph.')),
        u('paragraph', u('text', 'This is the second para.')),
      ]);

      expect(mdastToDoast(input)).toEqual(output);
    });

    it('Makes everything a child of a single first heading #7of8pQ', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
        ]),
      ]);

      expect(mdastToDoast(input as Root)).toEqual(output);
    });

    it('Creates 2 h1 and nests everything inside #yR8zli', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
        u('heading', { depth: 1 }, [u('text', 'A second top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the second heading.'),
        ]),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
        ]),
        u(
          'heading',
          { depth: 1, contents: [u('text', 'A second top heading')] },
          [
            u('paragraph', [
              u('text', 'This is a paragraph under the second heading.'),
            ]),
          ]
        ),
      ]);

      expect(mdastToDoast(input as Root)).toEqual(output);
    });

    it('Nests inside a second level heading #O4lCqF', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
        u('heading', { depth: 2 }, [u('text', 'A sub heading')]),
        u('paragraph', u('text', 'A second sub heading paragraph child.')),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
          u('heading', { depth: 2, contents: [u('text', 'A sub heading')] }, [
            u('paragraph', u('text', 'A second sub heading paragraph child.')),
          ]),
        ]),
      ]);

      expect(mdastToDoast(input as Root)).toEqual(output);
    });

    it('Nests inside a third level heading #8f0gRS', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
        u('heading', { depth: 2 }, [u('text', 'A sub heading')]),
        u('paragraph', u('text', 'A second sub heading paragraph child.')),
        u('heading', { depth: 3 }, [u('text', 'A sub sub heading')]),
        u('paragraph', u('text', 'A third sub sub heading paragraph child.')),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
          u('heading', { depth: 2, contents: [u('text', 'A sub heading')] }, [
            u('paragraph', u('text', 'A second sub heading paragraph child.')),
            u(
              'heading',
              { depth: 3, contents: [u('text', 'A sub sub heading')] },
              [
                u(
                  'paragraph',
                  u('text', 'A third sub sub heading paragraph child.')
                ),
              ]
            ),
          ]),
        ]),
      ]);

      expect(mdastToDoast(input as Root)).toEqual(output);
    });

    it('Nests multi level level headings #cSzDdI', () => {
      const input = u('root', [
        u('heading', { depth: 1 }, [u('text', 'A top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the first heading.'),
        ]),
        u('heading', { depth: 2 }, [u('text', 'A sub heading')]),
        u('paragraph', u('text', 'A second sub heading paragraph child.')),
        u('heading', { depth: 1 }, [u('text', 'A second top heading')]),
        u('paragraph', [
          u('text', 'This is a paragraph under the second top heading.'),
        ]),
        u('heading', { depth: 2 }, [u('text', 'A repeated sub heading')]),
        u(
          'paragraph',
          u('text', 'Another second sub heading paragraph child.')
        ),
        u('heading', { depth: 3 }, [u('text', 'A sub sub heading')]),
        u(
          'paragraph',
          u('text', 'A last third sub sub heading paragraph child.')
        ),
      ]);

      const output = u('root', [
        u('heading', { depth: 1, contents: [u('text', 'A top heading')] }, [
          u('paragraph', [
            u('text', 'This is a paragraph under the first heading.'),
          ]),
          u('heading', { depth: 2, contents: [u('text', 'A sub heading')] }, [
            u('paragraph', u('text', 'A second sub heading paragraph child.')),
          ]),
        ]),
        u(
          'heading',
          { depth: 1, contents: [u('text', 'A second top heading')] },
          [
            u('paragraph', [
              u('text', 'This is a paragraph under the second top heading.'),
            ]),
            u(
              'heading',
              { depth: 2, contents: [u('text', 'A repeated sub heading')] },
              [
                u(
                  'paragraph',
                  u('text', 'Another second sub heading paragraph child.')
                ),
                u(
                  'heading',
                  { depth: 3, contents: [u('text', 'A sub sub heading')] },
                  [
                    u(
                      'paragraph',
                      u('text', 'A last third sub sub heading paragraph child.')
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),
      ]);

      expect(mdastToDoast(input as Root)).toEqual(output);
    });
  });
});
