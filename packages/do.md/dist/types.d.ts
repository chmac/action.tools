import { Parent } from "unist";
import { RuleOption } from "./rschedule";
import { AFTER, EVERY, UNITS, DAYS, MONTHS, MONTHS_TO_NUMBER } from "./constants";
export declare type Unit = typeof UNITS[number];
export declare type Day = typeof DAYS[number];
export declare type Month = typeof MONTHS[number];
export declare type MonthNumber = typeof MONTHS_TO_NUMBER[Month];
export interface Task extends Parent {
    type: "listItem";
    checked?: boolean;
    spread?: boolean;
}
export declare type RepeatSimple = {
    type: "simple";
    repeat: typeof AFTER | typeof EVERY;
    unit: Unit;
    count: number;
};
export declare type RepeatWeekly = {
    type: "weekly";
    repeat: typeof EVERY;
    count: number;
    days: RuleOption.ByDayOfWeek[];
};
export declare type RepeatMonthly = {
    type: "monthly";
    repeat: typeof EVERY;
    dates: RuleOption.ByDayOfMonth[];
    months: RuleOption.ByMonthOfYear[];
};
export declare type Repeat = RepeatSimple | RepeatWeekly | RepeatMonthly;
