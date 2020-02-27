import { LocalDate } from "@js-joda/core";
import { Task } from "./types";
export declare const stringToLocalDate: (input: string) => LocalDate;
export declare const localDateToString: (date: LocalDate) => string;
export declare const getDateField: (key: string, task: Task) => LocalDate;
export declare const setDateField: (key: string, date: LocalDate, task: Task) => Task;
export declare const isTodayOrInTheFuture: (input: LocalDate, today: LocalDate) => boolean;
export declare const isTodayOrInThePast: (input: LocalDate, today: LocalDate) => boolean;
