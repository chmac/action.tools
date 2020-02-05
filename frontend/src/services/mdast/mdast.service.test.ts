import MockDate from "mockdate";

// import { describe } from 'jest'
import {
  getTaskTitle,
  markdownToMdast,
  getAllTasksFromTree,
  getNumberFromStart,
  getCountAndUnitFromString,
  isDay,
  isMonth,
  calculateNextOccurrence
} from "./mdast.service";

export const test = () => {};

const example = `
* [ ] Here's a top level task in a +Random project @home
* [ ] With another second task +ClearOut @work
  - A comment added to the second task
  - [ ] A sub task is also underneath the comment
`;

describe("todo.md", () => {
  describe("getNumberFromStart()", () => {
    it("correctly grabs number from 34foo", () => {
      expect(getNumberFromStart("34foo")).toEqual(34);
    });

    it("throws if the string does not start with a number", () => {
      expect(() => {
        getNumberFromStart("foo33");
      }).toThrow();
    });
  });

  describe("getNumberAndUnitFromString()", () => {
    it("correctly extracts from 3day #sqJ6JF", () => {
      expect(getCountAndUnitFromString("3day")).toEqual({
        count: 3,
        unit: "day"
      });
    });

    it("correctly extracts from 3days (plural) #WSAMh5", () => {
      expect(getCountAndUnitFromString("3days")).toEqual({
        count: 3,
        unit: "day"
      });
    });

    it("correctly parses double digit units #agX0SB", () => {
      expect(getCountAndUnitFromString("21weeks")).toEqual({
        count: 21,
        unit: "week"
      });
    });

    it("throws with an invalid unit #ItO0lI", () => {
      expect(() => getCountAndUnitFromString("33foo")).toThrow();
    });

    it("throws without a leading number #4g8Zd9", () => {
      expect(() => getCountAndUnitFromString("foo33")).toThrow();
    });

    it("throws without a number #MM9D2H", () => {
      expect(() => getCountAndUnitFromString("foobar")).toThrow();
    });
  });

  describe("isDay()", () => {
    it("accepts mon", () => {
      expect(isDay("mon")).toEqual(true);
    });

    it("does not accept foo", () => {
      expect(isDay("foo")).toEqual(false);
    });

    it("does not accept jan", () => {
      expect(isDay("jan")).toEqual(false);
    });
  });

  describe("isMonth()", () => {
    it("accepts jan #lSTvXr", () => {
      expect(isMonth("jan")).toEqual(true);
    });

    it("accepts dec #LMLuJM", () => {
      expect(isMonth("dec")).toEqual(true);
    });

    it("does not accept mon #68KwVx", () => {
      expect(isMonth("mon")).toEqual(false);
    });
  });

  describe("calculateNextOccurrence()", () => {
    const startTime = 1580917054000; // "2020-02-05T15:37:34.000";
    const plusThreeDays = 1581176254000; // "2020-02-08T15:37:34.000";
    const plusThreeWeeks = 1582731454000; // "2020-02-26T15:37:34.000";
    // This next date has jumped over a DST change
    const plusThreeMonths = 1588689454000; // "2020-05-05T14:37:34.000";

    beforeAll(() => {
      MockDate.set(startTime);
    });
    afterAll(() => {
      MockDate.reset();
    });

    it("does not throw #jjJjDz", () => {
      expect(() =>
        calculateNextOccurrence("every2days", new Date(startTime))
      ).not.toThrow();
    });

    it("adds 3 days #6gThb9", () => {
      expect(
        calculateNextOccurrence("every3days", new Date(startTime))
      ).toEqual(new Date(plusThreeDays));
    });

    it("adds 3 weeks #KW3nYS", () => {
      expect(
        calculateNextOccurrence("every3weeks", new Date(startTime))
      ).toEqual(new Date(plusThreeWeeks));
    });

    it("adds 3 months #1UX6WC", () => {
      expect(
        calculateNextOccurrence("every3months", new Date(startTime))
      ).toEqual(new Date(plusThreeMonths));
    });
  });

  describe("markdownToMdast #CSbVZJ", () => {
    it("matches snapshot", () => {
      const tree = markdownToMdast(example);
      expect(tree).toMatchSnapshot();
    });
  });

  describe("getAllTasksFromTree()", () => {
    it("Does not return the comment #oRaIwP", () => {
      const tree = markdownToMdast(example);
      const tasks = getAllTasksFromTree(tree);
      expect(tasks).toHaveLength(3);
    });
  });

  describe("getTaskTitle()", () => {
    it("Gets title with project and context #pMaXbr", () => {
      const tree = markdownToMdast(example);
      const [one, two, three] = getAllTasksFromTree(tree);
      expect(getTaskTitle(one)).toEqual(
        "Here's a top level task in a +Random project @home"
      );
      expect(getTaskTitle(two)).toEqual(
        "With another second task +ClearOut @work"
      );
      expect(getTaskTitle(three)).toEqual(
        "A sub task is also underneath the comment"
      );
    });
  });
});
