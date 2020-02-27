"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@js-joda/core");
var utils_1 = require("./utils");
exports.stringToLocalDate = function (input) {
    return core_1.LocalDate.parse(input);
};
exports.localDateToString = function (date) {
    return date.format(core_1.DateTimeFormatter.ofPattern("yyyy-MM-dd"));
};
exports.getDateField = function (key, task) {
    return exports.stringToLocalDate(utils_1.getKeyValue(key, task));
};
exports.setDateField = function (key, date, task) {
    var dateString = exports.localDateToString(date);
    return utils_1.setKeyValue(key, dateString, task);
};
exports.isTodayOrInTheFuture = function (input, today) {
    return input.compareTo(today) >= 0;
};
exports.isTodayOrInThePast = function (input, today) {
    return input.compareTo(today) <= 0;
};
