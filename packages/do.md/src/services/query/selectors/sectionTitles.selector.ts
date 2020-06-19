import { RootState, getLocalState } from '../../../store';
import { Section } from '../../../types';
import { Heading } from 'mdast';

const getTitleFromSection = (section: Section): string => {
  if (typeof section.heading !== 'undefined') {
    const { depth } = section.heading;
    const text = section.heading.children[0].value as string;
    return `${'#'.repeat(depth)} ${text}`;
  }

  if (section.contents.length > 0) {
    return section.contents[0].value as string;
  }

  return '';
};

export const recursivelyGetParents = ({
  search,
  startingDepth,
}: {
  search: Section[];
  startingDepth: number;
}): string[] => {
  const foundIndex = search.findIndex(
    section =>
      typeof section.heading !== 'undefined' &&
      section.heading.depth < startingDepth
  );

  if (foundIndex === -1) {
    return [];
  }

  const found = search[foundIndex];
  const foundDepth = (found.heading as Heading).depth;
  const title = getTitleFromSection(found);

  // if (found.heading?.depth === 1) {
  //   return [title]
  // }

  return [title].concat(
    recursivelyGetParents({
      search: search.slice(foundIndex),
      startingDepth: foundDepth,
    })
  );
};

/**
 * Given a sectionId, get it, and all its ancestors
 * NOTE: Currently only gets section & parent
 */
export const sectionTitles = (
  state: RootState,
  sectionId: string
): string[] => {
  const sections = getLocalState(state).data.sections;

  const sectionIndex = sections.findIndex(section => section.id === sectionId);
  if (sectionIndex === -1) {
    throw new Error('Missing section in recursivelyGetSection #BXMQpO');
  }

  const section = sections[sectionIndex];

  const title = getTitleFromSection(section);

  // If this section is the very first, or it has no heading, or its heading is
  // depth 1, then it has no ancestors, so return now
  if (
    sectionIndex === 0 ||
    typeof section.heading === 'undefined' ||
    section.heading.depth === 1
  ) {
    return [title];
  }

  const startingDepth = section.heading.depth;

  const search = sections.slice(0, sectionIndex).reverse();
  // .find(
  //   section =>
  //     typeof section.heading !== 'undefined' &&
  //     section.heading.depth < startingDepth
  // );

  if (search.length === 0) {
    return [title];
  }

  return [title].concat(recursivelyGetParents({ search, startingDepth }));
};
