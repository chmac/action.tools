// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import * as u from "unist-builder";

import {
  isTask,
  getTitle,
  getKeyValue,
  hasKeyValue,
  setKeyValue,
  removeKeyValue,
  getTags,
  startsWith,
  removeFromFront
} from "../utils";

import {
  task,
  listItemWithNullChecked,
  listItemWithoutChecked,
  makeTask
} from "./__fixtures__/tasks.fixtures";

describe("utils", () => {
  describe("isTask()", () => {
    it("Returns true for a task #zsMmqu", () => {
      expect(isTask(task)).toEqual(true);
    });

    it("Returns false for a listItem with checked = null #b9COnq", () => {
      expect(isTask(listItemWithNullChecked)).toEqual(false);
    });

    it("Returns false for a listItem without a checked value #tAMLDQ", () => {
      expect(isTask(listItemWithoutChecked)).toEqual(false);
    });
  });

  describe("getTitle()", () => {
    it("Fetches the correct title from a task #40FZ9E", () => {
      expect(getTitle(task)).toEqual(
        "This is an example text #FKG296 with a @context and a second #tag"
      );
    });

    it("Throws when given node which is not a task #sdPcjP", () => {
      expect(() => getTitle(listItemWithNullChecked)).toThrow();
    });
  });

  describe("statsWith()", () => {
    it("Returns true for after:foo at the beginning #AubUiK", () => {
      expect(startsWith("after", "after:foo")).toEqual(true);
    });

    it("Returns true for AFTER:foo at the beginning #mg0Qa3", () => {
      expect(startsWith("after", "AFTER:foo")).toEqual(true);
    });
  });

  describe("removeFromFront()", () => {
    it("Removes after: from after:foo` #9SSlpd", () => {
      expect(removeFromFront("after:", "after:foo")).toEqual("foo");
    });

    it("Removes after: from AFTER:foo #KsSmCR", () => {
      expect(removeFromFront("after:", "AFTER:foo")).toEqual("foo");
    });
  });

  describe("getKeyValue()", () => {
    it("Successfully finds after:2020-02-15 #xPovTS", () => {
      expect(
        getKeyValue(
          "after",
          makeTask("This is a task with key value pair #7lRBqI", false, [
            "after:2020-02-15"
          ])
        )
      ).toEqual("2020-02-15");
    });

    it("Successfully finds before:2020-02-15 #2Yvd5f", () => {
      expect(
        getKeyValue(
          "before",
          makeTask("This is a task with a key value pair #F9Yaie", false, [
            "before:2020-02-15"
          ])
        )
      ).toEqual("2020-02-15");
    });

    it("Successfully finds BEFORE:2020-02-15 #ZVle37", () => {
      expect(
        getKeyValue(
          "before",
          makeTask("This is a task with a key value pair #igRct9", false, [
            "BEFORE:2020-02-15"
          ])
        )
      ).toEqual("2020-02-15");
    });
  });

  describe("hasKeyValue()", () => {
    it("Correctly finds key:value #una37E", () => {
      const task = u(
        "listItem",
        {
          checked: true
        },
        [
          u("paragraph", [
            u("text", "There is some text here "),
            u("inlineCode", { value: "foo:bar" })
          ])
        ]
      );

      expect(hasKeyValue("foo", task)).toEqual(true);
    });

    it("Correctly returns when no key value #LueSRt", () => {
      const task = u(
        "listItem",
        {
          checked: true
        },
        [
          u("paragraph", [
            u("text", "There is some text here "),
            u("inlineCode", { value: "foo:bar" })
          ])
        ]
      );

      expect(hasKeyValue("baz", task)).toEqual(false);
    });
  });

  describe("setKeyValue()", () => {
    it("Correctly sets foo:baz #eWiDYd", () => {
      const task = u(
        "listItem",
        {
          checked: true
        },
        [
          u("paragraph", [
            u("text", "There is some text here "),
            u("inlineCode", { value: "foo:bar" })
          ])
        ]
      );

      const expected = u(
        "listItem",
        {
          checked: true
        },
        [
          u("paragraph", [
            u("text", "There is some text here "),
            u("inlineCode", { value: "foo:baz" })
          ])
        ]
      );

      expect(setKeyValue("foo", "baz", task)).toEqual(expected);
    });

    it("Adds the key:value if it does not exist #0LxFHH", () => {
      const task = u(
        "listItem",
        {
          checked: true
        },
        [u("paragraph", [u("text", "There is some text here")])]
      );

      const expected = u(
        "listItem",
        {
          checked: true
        },
        [
          u("paragraph", [
            u("text", "There is some text here"),
            u("inlineCode", { value: "foo:baz" })
          ])
        ]
      );

      expect(setKeyValue("foo", "baz", task)).toEqual(expected);
    });
  });

  describe("removeKeyValue()", () => {
    it("Removes foo:bar from end #auvgdq", () => {
      const task = u(
        "listItem",
        {
          checked: true
        },
        [
          u("paragraph", [
            u("text", "There is some text here"),
            u("inlineCode", { value: "foo:bar" })
          ])
        ]
      );

      const expected = u(
        "listItem",
        {
          checked: true
        },
        [u("paragraph", [u("text", "There is some text here")])]
      );

      expect(removeKeyValue("foo", task)).toEqual(expected);
    });
  });

  describe("getTags()", () => {
    it("Gets a single #hashtag #7iqKundefinedd", () => {
      expect(getTags("#", makeTask("Example task with #hashtag"))).toEqual([
        "#hashtag"
      ]);
    });

    it("Gets multple #hashtags #RtFolq", () => {
      expect(
        getTags(
          "#",
          makeTask("Example task with #hashtag and #foo and #bar tags")
        )
      ).toEqual(["#hashtag", "#foo", "#bar"]);
    });

    it("Gets multple @contexts #RtFolq", () => {
      expect(
        getTags("@", makeTask("Example task with @home and @work contexts"))
      ).toEqual(["@home", "@work"]);
    });
  });
});
