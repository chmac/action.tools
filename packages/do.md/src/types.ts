import { Content, Heading, ListItem, Paragraph, List } from 'mdast';
import {
  AFTER,
  DATA_KEYS,
  DAYS,
  EVERY,
  MONTHS,
  MONTHS_TO_NUMBER,
  UNITS,
} from './constants';
import { RuleOption } from './rschedule';

export type Unit = typeof UNITS[number];

export type Day = typeof DAYS[number];

export type Month = typeof MONTHS[number];

export type MonthNumber = typeof MONTHS_TO_NUMBER[Month];

export type Section = {
  /** Every section must have an ID, which may not be stable */
  id: string;
  depth: number;
  heading?: Heading;
  contents: Content[];
};

type ValidKeys = typeof DATA_KEYS[number];
export type ValidKeyData = {
  [key in ValidKeys]?: string;
};
export type TaskData = ValidKeyData & {
  contexts?: string[];
};

export interface Task {
  /** Every task must have an ID, generated if necessary */
  id: string;
  /** Empty string means this is a top level task */
  parentId: string;
  sectionId: string;
  finished: boolean;
  /**
   * If this is a sequential task, it can only be completed AFTER its preceding
   * sibling has been completed */
  isSequential: boolean;
  /** It's possible to have non-task items mixed between tasks. Like so:
   * - [ ] Task
   * - Not task
   * - [ ] Second task
   *
   * This field will be `false` in such cases.
   */
  isTask: boolean;
  data: TaskData;
  /**
   * The inner contents of this task, which must be a single paragraph, as
   * markdown. Excluding the leading "- [ ]" and the trailing " " double space.
   * */
  contentMarkdown: string;
}

export type RepeatSimple = {
  type: 'simple';
  repeat: typeof AFTER | typeof EVERY;
  unit: Unit;
  count: number;
};

export type RepeatWeekly = {
  type: 'weekly';
  repeat: typeof EVERY;
  count: number;
  days: RuleOption.ByDayOfWeek[];
};

export type RepeatMonthly = {
  type: 'monthly';
  repeat: typeof EVERY;
  dates: RuleOption.ByDayOfMonth[];
  months: RuleOption.ByMonthOfYear[];
};

export type Repeat = RepeatSimple | RepeatWeekly | RepeatMonthly;

export interface TaskListItem extends ListItem {
  children: [Paragraph] | [Paragraph, List];
}
