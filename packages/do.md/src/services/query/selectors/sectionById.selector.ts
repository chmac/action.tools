import { RootState, getLocalState } from '../../../store';

export const sectionById = (rootState: RootState, id: string) => {
  const section = getLocalState(rootState).data.sections.find(
    section => section.id === id
  );

  if (typeof section === 'undefined') {
    throw new Error('sectionById called with invalid id #7ssbmY');
  }

  return section;
};
