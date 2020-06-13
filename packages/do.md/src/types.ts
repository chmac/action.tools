import { LocalDate } from '@js-joda/core';
import { ListItem } from 'mdast';
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
  [ID]?: string;
}

export interface Task extends ListItem {
  taskData: TaskData;
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
