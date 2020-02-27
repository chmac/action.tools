import { Node } from "unist";
import { Task } from "./types";
export declare const getKeyValueRegExp: (key: string) => RegExp;
export declare const isTask: (node: Node) => node is Task;
export declare const getTitle: (task: Task) => string;
export declare const startsWith: (target: string, input: string) => boolean;
export declare const removeFromFront: (target: string, input: string) => string;
export declare const getKeyValue: (key: string, task: Task) => string;
export declare const hasKeyValue: (key: string, task: Task) => boolean;
export declare const setKeyValue: (key: string, value: string, task: Task) => Task;
export declare const removeKeyValue: (key: string, task: Task) => Task;
export declare const getTags: (prefix: string, task: Task) => string[];
