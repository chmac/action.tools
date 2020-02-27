"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unist_util_reduce_1 = require("unist-util-reduce");
var unist_util_select_1 = require("unist-util-select");
var utils_1 = require("./utils");
var dates_1 = require("./dates");
var constants_1 = require("./constants");
exports.doesTaskMatchFilter = function (task, filterText) {
    if (filterText === void 0) { filterText = ""; }
    // Always return true for an empty filter
    if (filterText.length === 0) {
        return true;
    }
    var title = utils_1.getTitle(task);
    return title.toLowerCase().indexOf(filterText) !== -1;
};
exports.isTaskSnoozed = function (task, today) {
    // When a task has no `snooze:` date, then it's not snoozed
    if (!utils_1.hasKeyValue(constants_1.SNOOZE, task)) {
        return false;
    }
    var snooze = dates_1.getDateField(constants_1.SNOOZE, task);
    return snooze.isAfter(today);
};
exports.isTaskActionableToday = function (task, today) {
    // When a task has no `after:` date, then it's always actioanble
    if (!utils_1.hasKeyValue(constants_1.AFTER, task)) {
        return true;
    }
    var after = dates_1.getDateField(constants_1.AFTER, task);
    return dates_1.isTodayOrInThePast(after, today);
};
exports.doesTaskMatchTodayFilter = function (task, today) {
    // If we don't have a date to match against, then all tasks match
    if (typeof today === "undefined") {
        return true;
    }
    if (exports.isTaskSnoozed(task, today) || !exports.isTaskActionableToday(task, today)) {
        return false;
    }
    return true;
};
// The `reduce()` runs depth first, starting from the deepest nodes and working
// upwards. By the time it runs for a parent task, the children will already
// have been removed if they do not match. This means any task which has child
// tasks, must have matching children.
exports.doesTaskHaveMatchingChildren = function (task) {
    var childTasks = unist_util_select_1.selectAll(":root > list listItem", task);
    return Boolean(childTasks.find(utils_1.isTask));
};
exports.filterTasks = function (root, filterText, today, showCompleted) {
    if (filterText === void 0) { filterText = ""; }
    if (showCompleted === void 0) { showCompleted = false; }
    if (filterText === "" && typeof today === "undefined") {
        return root;
    }
    return unist_util_reduce_1.default(root, function (task) {
        if (utils_1.isTask(task)) {
            // If this task has matching children, then we always consider it to be a
            // match, otherwise by removing this node we will also remove the
            // children.
            if (exports.doesTaskHaveMatchingChildren(task)) {
                return task;
            }
            // If we are NOT showing completed tasks AND this task is "checked", then
            // this task should be hidden
            if (!showCompleted && task.checked) {
                return [];
            }
            // To match this node, we must match both the date AND text filters
            if (exports.doesTaskMatchTodayFilter(task, today) &&
                exports.doesTaskMatchFilter(task, filterText)) {
                return task;
            }
            return [];
        }
        return task;
    });
};
