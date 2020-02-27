import { LocalDate, ZonedDateTime } from "@js-joda/core";
import { Task, Repeat, RepeatSimple, RepeatWeekly, RepeatMonthly } from "./types";
import { Rule } from "./rschedule";
export declare const nextDateOfIterationSimple: (repeat: RepeatSimple, start: LocalDate) => LocalDate;
export declare const getNextOccurrenceFromRule: (rule: Rule<any>) => LocalDate;
export declare const localDateToZonedDateTime: (start: LocalDate) => ZonedDateTime;
export declare const nextDateOfIterationWeekly: (repeat: RepeatWeekly, start: LocalDate) => LocalDate;
export declare const nextDateOfIterationMonthly: (repeat: RepeatMonthly, start: LocalDate) => LocalDate;
export declare const nextDateOfIteration: (repeat: Repeat, start: LocalDate) => LocalDate;
export declare const getRepeatFromDate: (repeat: Repeat, byDate: LocalDate) => LocalDate;
export declare const setNextByAndAfterDates: (task: Task) => Task;
export declare const createNextRepetitionTask: (task: Task) => Task;
export declare const calculateNextIteration: (task: Task) => Task[];