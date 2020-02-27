"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVERY = "every";
exports.AFTER = "after";
exports.BY = "by";
exports.REPEAT = "repeat";
exports.CREATED = "created";
exports.FINISHED = "finished";
exports.SNOOZE = "snooze";
exports.KEY_VALUE_SEPARATOR = ":";
exports.TAG_PREFIX = "#";
exports.CONTEXT_PREFIX = "@";
exports.PROJECT_PREFIX = "+";
// Combine this with the key ("created", etc) to create a RegExp
exports.KEY_VAR_REGEX_SUFFIX = ":[\\S]+";
exports.REGEX_SUFFIX = "[\\S]+";
exports.UNITS = ["month", "day", "week"];
exports.DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
exports.MONTHS = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
];
exports.MONTHS_TO_NUMBER = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
};
exports.ProjectRegex = new RegExp("@[\\w]+", "g");
var KeyVarRegexSuffix = ":[\\S]+";
exports.RepeatRegex = new RegExp("" + exports.REPEAT + KeyVarRegexSuffix);
exports.AfterRegex = new RegExp("" + exports.AFTER + KeyVarRegexSuffix);
exports.BeforeRegex = new RegExp("" + exports.BY + KeyVarRegexSuffix);
exports.CreatedRegex = new RegExp("" + exports.CREATED + KeyVarRegexSuffix);
exports.LeadingNumberRegex = new RegExp("");
