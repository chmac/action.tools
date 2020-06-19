import { recursivelyGetParents, sectionTitles } from './sectionTitles.selector';
import { Section } from '../../../types';
import { nanoid } from '@reduxjs/toolkit';

const makeSection = (depth: 1 | 2 | 3 | 4 | 5 | 6, title: string): Section => {
  return {
    contents: [],
    depth: 0,
    id: nanoid(),
    heading: {
      type: 'heading',
      depth: depth,
      children: [{ type: 'text', value: title }],
    },
  };
};

describe('sectionTitles.selector', () => {
  describe('recursivelyGetParents()', () => {
    it('Finds sequential heading titles #9kiHsd', () => {
      expect(
        recursivelyGetParents({
          search: [
            makeSection(3, 'Heading Level Three'),
            makeSection(2, 'Heading Level Two'),
            makeSection(1, 'Heading Level One'),
          ],
          startingDepth: 4,
        })
      ).toEqual([
        '### Heading Level Three',
        '## Heading Level Two',
        '# Heading Level One',
      ]);
    });

    it('Finds sequential heading titles 5 levels #sdVZUI', () => {
      expect(
        recursivelyGetParents({
          search: [
            makeSection(5, 'Heading Level Five'),
            makeSection(4, 'Heading Level Four'),
            makeSection(3, 'Heading Level Three'),
            makeSection(2, 'Heading Level Two'),
            makeSection(1, 'Heading Level One'),
          ],
          startingDepth: 6,
        })
      ).toEqual([
        '##### Heading Level Five',
        '#### Heading Level Four',
        '### Heading Level Three',
        '## Heading Level Two',
        '# Heading Level One',
      ]);
    });

    it('Skips lower headings #gHdeZO', () => {
      expect(
        recursivelyGetParents({
          search: [
            makeSection(5, 'Heading Level Five'),
            makeSection(4, 'Heading Level Four'),
            makeSection(3, 'Heading Level Three'),
            makeSection(2, 'Heading Level Two'),
            makeSection(1, 'Heading Level One'),
          ],
          startingDepth: 4,
        })
      ).toEqual([
        '### Heading Level Three',
        '## Heading Level Two',
        '# Heading Level One',
      ]);
    });

    it('Skips same level headings out of sequence #5H40Te', () => {
      expect(
        recursivelyGetParents({
          search: [
            makeSection(4, 'Heading Level Four'),
            makeSection(5, 'Heading Level Five'),
            makeSection(4, 'Heading Level Four'),
            makeSection(3, 'Heading Level Three'),
            makeSection(2, 'Heading Level Two'),
            makeSection(1, 'Heading Level One'),
          ],
          startingDepth: 4,
        })
      ).toEqual([
        '### Heading Level Three',
        '## Heading Level Two',
        '# Heading Level One',
      ]);
    });

    it('Skips sections without headigs #CDT8Vp', () => {
      expect(
        recursivelyGetParents({
          search: [
            { ...makeSection(1, ''), heading: undefined },
            makeSection(4, 'Heading Level Four'),
            makeSection(5, 'Heading Level Five'),
            makeSection(4, 'Heading Level Four'),
            makeSection(3, 'Heading Level Three'),
            makeSection(2, 'Heading Level Two'),
            makeSection(1, 'Heading Level One'),
          ],
          startingDepth: 4,
        })
      ).toEqual([
        '### Heading Level Three',
        '## Heading Level Two',
        '# Heading Level One',
      ]);
    });
  });

  describe('sectionTitles()', () => {
    expect(sectionTitles);
  });
});
