import { Parent } from "unist";
import { ListItem } from "mdast";

import { RuleOption } from "./rschedule";

import {
  AFTER,
  EVERY,
  UNITS,
  DAYS,
  MONTHS,
  MONTHS_TO_NUMBER,
  BY,
  REPEAT,
  CREATED,
  FINISHED,
} from "./constants";
import { LocalDate } from "@js-joda/core";
// import { buildDataForTask } from "../../services/domd/domd.utils";

export type Unit = typeof UNITS[number];

export type Day = typeof DAYS[number];

export type Month = typeof MONTHS[number];

export type MonthNumber = typeof MONTHS_TO_NUMBER[Month];

// export type Data = ReturnType<typeof buildDataForTask>;

export interface Task extends ListItem {
  data: {
    [AFTER]?: LocalDate;
    [BY]?: LocalDate;
    [REPEAT]?: LocalDate;
    [CREATED]?: LocalDate;
    [FINISHED]?: LocalDate;
    id?: string;
  };
}

export type RepeatSimple = {
  type: "simple";
  repeat: typeof AFTER | typeof EVERY;
  unit: Unit;
  count: number;
};

export type RepeatWeekly = {
  type: "weekly";
  repeat: typeof EVERY;
  count: number;
  days: RuleOption.ByDayOfWeek[];
};

export type RepeatMonthly = {
  type: "monthly";
  repeat: typeof EVERY;
  dates: RuleOption.ByDayOfMonth[];
  months: RuleOption.ByMonthOfYear[];
};

export type Repeat = RepeatSimple | RepeatWeekly | RepeatMonthly;
