import { Node, Parent } from "unist";

import {
  AFTER,
  EVERY,
  UNITS,
  DAYS,
  MONTHS,
  MONTHS_TO_NUMBER
} from "./constants";
import { buildDataForTask } from "../../services/domd/domd.utils";

export type Unit = typeof UNITS[number];

export type Day = typeof DAYS[number];

export type Month = typeof MONTHS[number];

export type MonthNumber = typeof MONTHS_TO_NUMBER[Month];

export type Data = ReturnType<typeof buildDataForTask>;

export interface Task extends Node {
  type: "listItem";
  // _data: Data;
}

export type Repeat = {
  count: number;
  unit: Unit;
  type: typeof AFTER | typeof EVERY;
};
