import { AppThunk } from '../../../store';
import { Section, Task } from '../../../types';
import { markdownToMdast } from '../../../__fixtures__/markdown.fixtures';
import { parseMdast } from '../../parser/parser.service';
import { setSections, setTasks } from '../../data/data.state';

export const startup = ({ markdown }: { markdown: string }): AppThunk => async (
  dispatch,
  getRootState
) => {
  console.log('Root start on boot #bzvBIU', getRootState());
  const sections = parseMdast(markdownToMdast(markdown));

  const allTasks: Task[] = [];
  const sectionsWithoutTasks: Section[] = [];

  sections.forEach(section => {
    const { tasks, ...sectionWithoutTasks } = section;
    sectionsWithoutTasks.push(sectionWithoutTasks);
    allTasks.push(...tasks);
  });

  dispatch(setSections(sectionsWithoutTasks));
  dispatch(setTasks(allTasks));
};
