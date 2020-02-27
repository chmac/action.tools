"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("remeda");
var core_1 = require("@js-joda/core");
var rschedule_1 = require("./rschedule");
var repeat_1 = require("./repeat");
var utils_1 = require("./utils");
var dates_1 = require("./dates");
var constants_1 = require("./constants");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var notReachable = function (_x) {
    throw new Error("Unknown never error. #m3lX5k");
};
exports.nextDateOfIterationSimple = function (repeat, start) {
    var count = repeat.count, unit = repeat.unit;
    if (unit === "day") {
        return start.plusDays(count);
    }
    else if (unit === "week") {
        return start.plusWeeks(count);
    }
    else if (unit === "month") {
        return start.plusMonths(count);
    }
    return notReachable(unit);
};
exports.getNextOccurrenceFromRule = function (rule) {
    var next = rule.occurrences({ take: 1 }).toArray()[0];
    return core_1.LocalDate.from(next.date);
};
exports.localDateToZonedDateTime = function (start) {
    return core_1.ZonedDateTime.of(start, core_1.LocalTime.of(), core_1.ZoneOffset.UTC);
};
exports.nextDateOfIterationWeekly = function (repeat, start) {
    var rule = new rschedule_1.Rule({
        frequency: "WEEKLY",
        byDayOfWeek: repeat.days,
        start: exports.localDateToZonedDateTime(start)
    });
    return exports.getNextOccurrenceFromRule(rule);
};
exports.nextDateOfIterationMonthly = function (repeat, start) {
    var rule = new rschedule_1.Rule({
        frequency: "YEARLY",
        byDayOfMonth: repeat.dates,
        byMonthOfYear: repeat.months,
        start: exports.localDateToZonedDateTime(start)
    });
    return exports.getNextOccurrenceFromRule(rule);
};
exports.nextDateOfIteration = function (repeat, start) {
    switch (repeat.type) {
        case "simple": {
            return exports.nextDateOfIterationSimple(repeat, start);
        }
        case "weekly": {
            return exports.nextDateOfIterationWeekly(repeat, start);
        }
        case "monthly": {
            return exports.nextDateOfIterationMonthly(repeat, start);
        }
    }
    return notReachable(repeat);
};
exports.getRepeatFromDate = function (repeat, byDate) {
    switch (repeat.repeat) {
        case constants_1.EVERY: {
            return byDate;
        }
        case constants_1.AFTER: {
            return core_1.LocalDate.now();
        }
    }
    return notReachable(repeat);
};
exports.setNextByAndAfterDates = function (task) {
    var repeatString = utils_1.getKeyValue(constants_1.REPEAT, task);
    if (repeatString.length === 0) {
        throw new Error("Cannot calculate next iteration for task without repepat. #wjVJOL");
    }
    var repeat = repeat_1.getRepeatParams(repeatString);
    var byDate = dates_1.getDateField(constants_1.BY, task);
    var afterString = utils_1.getKeyValue(constants_1.AFTER, task);
    var repeatFromDate = exports.getRepeatFromDate(repeat, byDate);
    var nextByDate = exports.nextDateOfIteration(repeat, repeatFromDate);
    var withNextByDate = dates_1.setDateField(constants_1.BY, nextByDate, task);
    if (afterString.length === 0) {
        return withNextByDate;
    }
    var afterDate = dates_1.getDateField(constants_1.AFTER, task);
    var daysBetweenAfterAndBy = afterDate.until(byDate);
    var nextAfterDate = nextByDate.minus(daysBetweenAfterAndBy);
    return dates_1.setDateField(constants_1.AFTER, nextAfterDate, task);
};
exports.createNextRepetitionTask = function (task) {
    return R.pipe(task, function (task) { return utils_1.removeKeyValue(constants_1.FINISHED, task); }, function (task) { return exports.setNextByAndAfterDates(task); }, R.set("checked", false));
};
exports.calculateNextIteration = function (task) {
    var nextTask = exports.createNextRepetitionTask(task);
    var taskWithFinished = dates_1.setDateField(constants_1.FINISHED, core_1.LocalDate.now(), task);
    return [nextTask, taskWithFinished];
};
