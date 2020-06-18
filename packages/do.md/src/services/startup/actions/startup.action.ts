import { AppThunk } from '../../../store';
import { Section, Task } from '../../../types';
import { markdownToMdast } from '../../../__fixtures__/markdown.fixtures';
import { setData } from '../../data/data.state';
import { parseMdast } from '../../parser/parser.service';

export const startup = ({ markdown }: { markdown: string }): AppThunk => async (
  dispatch,
  getRootState
) => {
  const sections = parseMdast(markdownToMdast(markdown));

  const allTasks: Task[] = [];
  const sectionsWithoutTasks: Section[] = [];

  sections.forEach(section => {
    const { tasks, ...sectionWithoutTasks } = section;
    sectionsWithoutTasks.push(sectionWithoutTasks);
    const tasksWithSectionId = tasks.map(task => ({
      ...task,
      sectionId: section.id,
    }));
    allTasks.push(...tasksWithSectionId);
  });

  dispatch(setData({ sections: sectionsWithoutTasks, tasks: allTasks }));
};
