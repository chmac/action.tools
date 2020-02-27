"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var tasks_fixtures_1 = require("./fixtures/tasks.fixtures");
describe("utils", function () {
    describe("isTask()", function () {
        it("Returns true for a task #zsMmqu", function () {
            expect(utils_1.isTask(tasks_fixtures_1.task)).toEqual(true);
        });
        it("Returns false for a listItem with checked = null #b9COnq", function () {
            expect(utils_1.isTask(tasks_fixtures_1.listItemWithNullChecked)).toEqual(false);
        });
        it("Returns false for a listItem without a checked value #tAMLDQ", function () {
            expect(utils_1.isTask(tasks_fixtures_1.listItemWithoutChecked)).toEqual(false);
        });
    });
    describe("getTitle()", function () {
        it("Fetches the correct title from a task #40FZ9E", function () {
            expect(utils_1.getTitle(tasks_fixtures_1.task)).toEqual("This is an example text #FKG296 with a @context and a second #tag");
        });
        it("Throws when given node which is not a task #sdPcjP", function () {
            expect(function () { return utils_1.getTitle(tasks_fixtures_1.listItemWithNullChecked); }).toThrow();
        });
    });
    describe("statsWith()", function () {
        it("Returns true for after:foo at the beginning #AubUiK", function () {
            expect(utils_1.startsWith("after", "after:foo")).toEqual(true);
        });
        it("Returns true for AFTER:foo at the beginning #mg0Qa3", function () {
            expect(utils_1.startsWith("after", "AFTER:foo")).toEqual(true);
        });
    });
    describe("removeFromFront()", function () {
        it("Removes after: from after:foo #9SSlpd", function () {
            expect(utils_1.removeFromFront("after:", "after:foo")).toEqual("foo");
        });
        it("Removes after: from AFTER:foo #KsSmCR", function () {
            expect(utils_1.removeFromFront("after:", "AFTER:foo")).toEqual("foo");
        });
    });
    describe("getKeyValue()", function () {
        it("Successfully finds after:2020-02-15 #xPovTS", function () {
            expect(utils_1.getKeyValue("after", tasks_fixtures_1.makeTask("This is a task with a after:2020-02-15 key value pair #7lRBqI"))).toEqual("2020-02-15");
        });
        it("Successfully finds before:2020-02-15 #2Yvd5f", function () {
            expect(utils_1.getKeyValue("before", tasks_fixtures_1.makeTask("This is a task with a before:2020-02-15 key value pair #F9Yaie"))).toEqual("2020-02-15");
        });
        it("Successfully finds BEFORE:2020-02-15 #ZVle37", function () {
            expect(utils_1.getKeyValue("before", tasks_fixtures_1.makeTask("This is a task with a BEFORE:2020-02-15 key value pair #igRct9"))).toEqual("2020-02-15");
        });
    });
    describe("getTags()", function () {
        it("Gets a single #hashtag #7iqKundefinedd", function () {
            expect(utils_1.getTags("#", tasks_fixtures_1.makeTask("Example task with #hashtag"))).toEqual([
                "#hashtag"
            ]);
        });
        it("Gets multple #hashtags #RtFolq", function () {
            expect(utils_1.getTags("#", tasks_fixtures_1.makeTask("Example task with #hashtag and #foo and #bar tags"))).toEqual(["#hashtag", "#foo", "#bar"]);
        });
        it("Gets multple @contexts #RtFolq", function () {
            expect(utils_1.getTags("@", tasks_fixtures_1.makeTask("Example task with @home and @work contexts"))).toEqual(["@home", "@work"]);
        });
    });
});
