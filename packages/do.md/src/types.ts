import { LocalDate } from '@js-joda/core';
import { ListItem, BlockContent } from 'mdast';
import {
  AFTER,
  BY,
  CREATED,
  DAYS,
  EVERY,
  FINISHED,
  ID,
  MONTHS,
  MONTHS_TO_NUMBER,
  REPEAT,
  UNITS,
} from './constants';
import { RuleOption } from './rschedule';

export type Unit = typeof UNITS[number];

export type Day = typeof DAYS[number];

export type Month = typeof MONTHS[number];

export type MonthNumber = typeof MONTHS_TO_NUMBER[Month];

// export type Data = ReturnType<typeof buildDataForTask>;
export interface TaskData {
  [AFTER]?: LocalDate;
  [BY]?: LocalDate;
  [REPEAT]?: LocalDate;
  [CREATED]?: LocalDate;
  [FINISHED]?: LocalDate;
  /** This is only set if the markdown contains an ID field */
  [ID]?: string;
}

export interface Task {
  /** Every task must have an ID, generated if necessary */
  id: string;
  parentId?: string;
  finished: boolean;
  /** A string representation of the text of the task, can contain newlines */
  text: string;
  data: TaskData;
  /**
   * This contains the direct descendents of the listItem element, excluding any
   * nested list elements */
  contents: BlockContent[];
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
