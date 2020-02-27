"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("remeda");
var unist_util_reduce_1 = require("unist-util-reduce");
var unist_util_select_1 = require("unist-util-select");
var constants_1 = require("./constants");
exports.getKeyValueRegExp = function (key) {
    return new RegExp("" + key + constants_1.KEY_VAR_REGEX_SUFFIX);
};
exports.isTask = function (node) {
    return node.type === "listItem" && typeof node.checked === "boolean";
};
exports.getTitle = function (task) {
    if (!exports.isTask(task)) {
        throw new Error("getTitle() was called on a non task #3RAdcI");
    }
    return R.map(unist_util_select_1.selectAll(":root > paragraph > text", task), R.prop("value")).join(" ");
};
exports.startsWith = function (target, input) {
    return input.substr(0, target.length).toLowerCase() === target;
};
exports.removeFromFront = function (target, input) {
    if (!exports.startsWith(target, input)) {
        return input;
    }
    return input.substr(target.length);
};
exports.getKeyValue = function (key, task) {
    // TODO Expand to support nested lists without checkboxes
    var text = exports.getTitle(task);
    // NOTE: We set the `i` flag on this regex because we want to match both KEY
    // and key
    var regex = new RegExp("" + key + constants_1.KEY_VALUE_SEPARATOR + constants_1.REGEX_SUFFIX, "gi");
    var matches = text.match(regex);
    if (matches === null) {
        return "";
    }
    else if (matches.length === 1) {
        return exports.removeFromFront("" + key + constants_1.KEY_VALUE_SEPARATOR, matches[0]);
    }
    throw new Error("Found multiple matches for key value pair #NLqNJZ");
};
exports.hasKeyValue = function (key, task) {
    var value = exports.getKeyValue(key, task);
    return value.length !== 0;
};
exports.setKeyValue = function (key, value, task) {
    return unist_util_reduce_1.default(task, function (node) {
        if (node.type === "text") {
            var oldValue = node.value;
            var replacedString = oldValue.replace(exports.getKeyValueRegExp(key), key + ":" + value);
            // If the replacement did not change anything, then the key was not found
            // in the string, in this case append the new key:value pair.
            if (replacedString === oldValue) {
                return R.set(node, "value", oldValue + " " + key + ":" + value);
            }
            return R.set(node, "value", replacedString);
        }
        return node;
    });
};
exports.removeKeyValue = function (key, task) {
    return unist_util_reduce_1.default(task, function (node) {
        if (node.type === "text") {
            var oldValue = node.value;
            var replacedString = oldValue
                // NOTE: We replace the `key:value` pair including a LEADING space, and
                // then including a TRAILING space to ensure that we always remove a
                // single space and the pattern itself.
                .replace(new RegExp(" " + key + constants_1.KEY_VAR_REGEX_SUFFIX), "")
                .replace(new RegExp("" + key + constants_1.KEY_VAR_REGEX_SUFFIX + " "), "");
            return R.set(node, "value", replacedString);
        }
        return node;
    });
};
exports.getTags = function (prefix, task) {
    // TODO Expand to support nested lists without checkboxes
    var text = exports.getTitle(task);
    var regex = new RegExp("" + prefix + constants_1.REGEX_SUFFIX, "g");
    var matches = text.match(regex);
    return matches || [];
};
