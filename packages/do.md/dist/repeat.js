"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("remeda");
var unist_util_reduce_1 = require("unist-util-reduce");
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var calculateNextIteration_1 = require("./calculateNextIteration");
var utils_2 = require("./utils");
var leadingNumberRegex = new RegExp("^[\\d,]+");
exports.getLeadingNumbers = function (input) {
    var matches = input.match(leadingNumberRegex);
    if (matches === null) {
        return [];
    }
    if (matches.index !== 0) {
        throw new Error("Unknown error parsing repeat string #vX5cVc");
    }
    if (matches[0].substr(-1) === ",") {
        throw new Error("Error parsing repeat string. Too many commas. #Oew9pV");
    }
    var strings = matches[0].split(",");
    var numbers = R.map(strings, parseInt);
    return numbers;
};
exports.isDay = function (input) {
    return constants_1.DAYS.indexOf(input) !== -1;
};
exports.isMonth = function (input) {
    return constants_1.MONTHS.indexOf(input) !== -1;
};
exports.isUnit = function (input) {
    return constants_1.UNITS.indexOf(input) !== -1;
};
exports.isDayOfMonth = function (input) {
    return typeof input === "number" && input >= -31 && input <= 31;
};
exports.dayInputToDayOfWeek = function (input) {
    return input.substr(0, 2).toUpperCase();
};
exports.monthsInputToMonthOfYear = function (input) {
    return constants_1.MONTHS_TO_NUMBER[input];
};
exports.getRepeatParams = function (input) {
    var repeat = utils_1.startsWith(constants_1.EVERY, input)
        ? constants_1.EVERY
        : utils_1.startsWith(constants_1.AFTER, input)
            ? constants_1.AFTER
            : null;
    if (repeat === null) {
        throw new Error("Invalid repeat string #ITAWtF");
    }
    // Strip the leading every or after string
    var countAndUnit = utils_1.removeFromFront(repeat, input);
    var numbers = exports.getLeadingNumbers(countAndUnit);
    // NOTE: We convert to lower case here to ensure case insensitivity
    var unit = utils_1.removeFromFront(numbers.join(","), countAndUnit).toLowerCase();
    var multpleUnits = unit.split(",");
    if (multpleUnits.length > 1) {
        if (repeat === constants_1.AFTER) {
            throw new Error("Invalid repeat string. Cannot mix after and multiple values. #Ah2i8c");
        }
        if (multpleUnits.every(exports.isDay)) {
            // TypeScript cannot infer from the `.every()` type predicate
            var days = multpleUnits.map(exports.dayInputToDayOfWeek);
            // NOTE: We default to every 1 week if a number was not specified
            var count_1 = numbers.length === 1 ? numbers[0] : 1;
            return {
                type: "weekly",
                repeat: repeat,
                count: count_1,
                days: days
            };
        }
        else if (multpleUnits.every(exports.isMonth)) {
            if (numbers.length === 0) {
                throw new Error("Invalid repeat string. No dates specified. #qBE8YE");
            }
            if (!numbers.every(exports.isDayOfMonth)) {
                throw new Error("Invalid repeat string. Date >31. #hciAdh");
            }
            // TypeScript cannot infer from the `.every()` type predicate
            var months = multpleUnits.map(exports.monthsInputToMonthOfYear);
            return {
                type: "monthly",
                repeat: repeat,
                // TypeScript cannot infer from the `.every()` type predicate
                dates: numbers,
                months: months
            };
        }
        else {
            throw new Error("Invalid repeat string #fJhZTU");
        }
    }
    var trimmedUnit = unit.replace(/s$/, "");
    if (!exports.isUnit(trimmedUnit)) {
        throw new Error("Invalid repeat string. Invalid unit: " + trimmedUnit + ". #fL3bsD");
    }
    var count = numbers[0];
    return {
        type: "simple",
        repeat: repeat,
        unit: trimmedUnit,
        count: count
    };
};
exports.repeatTasks = function (root) {
    return unist_util_reduce_1.default(root, function (task) {
        if (utils_2.isTask(task)) {
            if (
            // Only repeat tasks which are closed
            task.checked === true &&
                // Only repeat tasks which do not have a finished date
                !utils_2.hasKeyValue(constants_1.FINISHED, task) &&
                // Only repeat tasks which do have a repeat field
                utils_2.hasKeyValue(constants_1.REPEAT, task)) {
                return calculateNextIteration_1.calculateNextIteration(task);
            }
        }
        return task;
    });
};
