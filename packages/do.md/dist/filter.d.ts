import { Parent } from "unist";
import { Task } from "./types";
import { LocalDate } from "@js-joda/core";
export declare const doesTaskMatchFilter: (task: Task, filterText?: string) => boolean;
export declare const isTaskSnoozed: (task: Task, today: LocalDate) => boolean;
export declare const isTaskActionableToday: (task: Task, today: LocalDate) => boolean;
export declare const doesTaskMatchTodayFilter: (task: Task, today?: LocalDate | undefined) => boolean;
export declare const doesTaskHaveMatchingChildren: (task: Task) => boolean;
export declare const filterTasks: (root: Parent, filterText?: string, today?: LocalDate | undefined, showCompleted?: boolean) => Parent;
