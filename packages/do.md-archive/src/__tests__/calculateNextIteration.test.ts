// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import { LocalDate } from "@js-joda/core";
import { advanceTo, clear } from "jest-date-mock";

import {
  nextDateOfIterationSimple,
  nextDateOfIterationWeekly,
  nextDateOfIterationMonthly,
  nextDateOfIteration,
  nextDateOfIterationAfterToday,
  setNextByAndAfterDates,
  createNextRepetitionTask,
} from "../calculateNextIteration";
import { makeTask } from "./__fixtures__/tasks.fixtures";
import { today, tomorrow } from "./__fixtures__/dates.fixtures";
import { AFTER, BY } from "../constants";

describe("calculateNextIteration", () => {
  beforeAll(() => {
    advanceTo(new Date(2020, 1, 24));
  });
  afterAll(() => {
    clear();
  });

  describe("nextDateOfIterationSimple", () => {
    it("Correctly adds 3 days #WMSXx4", () => {
      expect(
        nextDateOfIterationSimple(
          {
            type: "simple",
            repeat: "every",
            count: 3,
            unit: "day",
          },
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 2, 16));
    });

    it("Correctly adds 3 weeks #lQ7FGF", () => {
      expect(
        nextDateOfIterationSimple(
          {
            type: "simple",
            repeat: "every",
            count: 3,
            unit: "week",
          },
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 3, 5));
    });

    it("Correctly adds 3 months #hzNOWI", () => {
      expect(
        nextDateOfIterationSimple(
          {
            type: "simple",
            repeat: "every",
            count: 3,
            unit: "month",
          },
          // NOTE: This is a leap year
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 5, 13));
    });

    it("Correctly adds 3 years #itMM7s", () => {
      expect(
        nextDateOfIterationSimple(
          {
            type: "simple",
            repeat: "every",
            count: 3,
            unit: "year",
          },
          // NOTE: This is a leap year
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2023, 2, 13));
    });
  });

  describe("nextDateOfIterationWeekly()", () => {
    it("Correctly calculates next mo,we #GBtSq5", () => {
      expect(
        nextDateOfIterationWeekly(
          { type: "weekly", repeat: "every", days: ["MO", "WE"], count: 1 },
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 2, 17));
    });
  });

  describe("nextDateOfIterationMonthly()", () => {
    it("Correctly calculates next 1,4,19,22 of jan,apr,jul #NNds2c", () => {
      expect(
        nextDateOfIterationMonthly(
          {
            type: "monthly",
            repeat: "every",
            dates: [1, 4, 19, 22],
            months: [1, 4, 7, 10],
          },
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 4, 1));
    });
  });

  describe("nextDateOfIteration()", () => {
    it("Calculates a date in the past #oaeFNf", () => {
      expect(
        nextDateOfIteration(
          {
            type: "simple",
            repeat: "every",
            count: 1,
            unit: "day",
          },
          LocalDate.of(2020, 1, 1)
        )
      ).toEqual(LocalDate.of(2020, 1, 2));
    });
  });

  describe("nextDateOfIterationAfterToday()", () => {
    it("Finds a date in the future #98vsou", () => {
      expect(
        nextDateOfIterationAfterToday(
          {
            type: "simple",
            repeat: "every",
            count: 1,
            unit: "day",
          },
          LocalDate.of(2020, 1, 1),
          today
        )
      ).toEqual(tomorrow);
    });

    it("Adds 1 month to a by date 10 days in teh past #Mm433A", () => {
      expect(
        nextDateOfIterationAfterToday(
          {
            type: "simple",
            repeat: "every",
            count: 1,
            unit: "month",
          },
          LocalDate.of(2020, 2, 14),
          today
        )
      ).toEqual(LocalDate.of(2020, 3, 14));
    });

    it("Adds 2 months to a by date 1 month and 10 days in the past #wu73J7", () => {
      expect(
        nextDateOfIterationAfterToday(
          {
            type: "simple",
            repeat: "every",
            count: 1,
            unit: "month",
          },
          LocalDate.of(2020, 1, 14),
          today
        )
      ).toEqual(LocalDate.of(2020, 3, 14));
    });
  });

  describe("setNextByAndAfterDates()", () => {
    it.each([
      ["#AWxyMB", "by", "2020-02-21", "2020-02-27", "after3days"],
      ["#nbgEST", "after", "2020-02-21", "2020-02-27", "after3days"],
      ["#4Of7Th", "by", "2020-02-10", "2020-02-27", "after3days"],
      ["#DMACIr", "after", "2020-02-10", "2020-02-27", "after3days"],
      ["#KdO06E", "by", "2020-02-24", "2020-02-27", "after3days"],
      ["#Mqx3Nf", "after", "2020-02-24", "2020-02-27", "after3days"],
      ["#KD5WiY", "by", "2020-01-01", "2020-04-01", "every3months"],
      ["#BRu46f", "after", "2020-01-01", "2020-04-01", "every3months"],
      ["#lfBQzl", "by", "2020-01-01", "2020-05-24", "after3months"],
      ["#tcCxTc", "after", "2020-01-01", "2020-05-24", "after3months"],
      ["#AcUeUe", "by", "2020-04-01", "2020-07-01", "every3months"],
      ["#ptYUcG", "after", "2020-04-01", "2020-07-01", "every3months"],
      ["#R4QTE0", "by", "2020-07-01", "2020-10-01", "every3months"],
      ["#MsO9WQ", "after", "2020-07-01", "2020-10-01", "every3months"],
    ])(
      "single date %s type %s start %s expected %s repeat %s #oVCcNv",
      (_, dateType, inputDate, expectedDate, repeatString) => {
        const title = "An example task";
        const task = makeTask(title, true, [
          `${dateType}:${inputDate}`,
          `repeat:${repeatString}`,
        ]);
        const expected = makeTask(title, true, [
          `${dateType}:${expectedDate}`,
          `repeat:${repeatString}`,
        ]);
        expect(setNextByAndAfterDates(task, today)).toEqual(expected);
      }
    );

    it.each([
      [
        "#OeDSVL",
        "2020-02-12", // After a week past Wednesday
        "2020-02-14", // By a week past Friday
        "2020-02-26", // This Wednesday
        "2020-02-28", // This Fridayj
        "every1week",
      ],
      [
        "#RVE3BG",
        "2020-02-12", // After a week past Wednesday
        "2020-02-14", // By a week past Friday
        "2020-02-29", // One week minus 2 days from today
        "2020-03-02", // One week from today
        "after1week",
      ],
      [
        "#pIAGl2",
        "2020-01-01",
        "2020-02-28", // Future
        "2020-04-01",
        "2020-05-28",
        "every3months",
      ],
      [
        "#aeeTEd",
        "2020-01-01",
        "2020-02-28", // Future
        "2020-03-28",
        "2020-05-24",
        "after3months",
      ],
      [
        "#zo6wo9",
        "2020-01-01",
        "2020-01-07", // Past
        "2020-04-01",
        "2020-04-07",
        "every3months",
      ],
      [
        "#W57lTF",
        "2020-01-01",
        "2020-01-07", // Past
        "2020-05-18",
        "2020-05-24",
        "after3months",
      ],
      [
        "#j5DsWo",
        "2020-01-01",
        "2020-02-10", // Past
        "2020-04-01",
        "2020-05-10",
        "every3months",
      ],
      [
        "#Q5iS36",
        "2020-01-01",
        "2020-02-10", // Past
        "2020-04-15",
        "2020-05-24",
        "after3months",
      ],
    ])(
      "by and after dates %s (after: %s, by: %s) (after: %s, by: %s) repeat: %s #oVCcNv",
      (
        _,
        afterInputDate,
        byInputDate,
        afterExpectedDate,
        byExpectedDate,
        repeatString
      ) => {
        const title = "An example task";
        const task = makeTask(title, true, [
          `${AFTER}:${afterInputDate}`,
          `${BY}:${byInputDate}`,
          `repeat:${repeatString}`,
        ]);
        const expected = makeTask(title, true, [
          `${AFTER}:${afterExpectedDate}`,
          `${BY}:${byExpectedDate}`,
          `repeat:${repeatString}`,
        ]);
        expect(setNextByAndAfterDates(task, today)).toEqual(expected);
      }
    );

    it("Always selects a date after the last date #6JzpMD", () => {
      const task = makeTask(
        "An example task last Monday repeating on Mondays",
        true,
        ["after:2020-02-19", "repeat:everywed"]
      );
      const expected = makeTask(
        "An example task last Monday repeating on Mondays",
        true,
        ["after:2020-02-26", "repeat:everywed"]
      );
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it("Correctly skips today if today was the next iteration #xiw8x9", () => {
      const task = makeTask(
        "An example task last Monday repeating on Mondays",
        true,
        ["after:2020-02-17", "repeat:everymon"]
      );
      const expected = makeTask(
        "An example task last Monday repeating on Mondays",
        true,
        ["after:2020-03-02", "repeat:everymon"]
      );
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it("Correctly calculates for after:2020-02-24 repeat:every3days without a by date #b3qWvU", () => {
      const task = makeTask("A simple task", true, [
        "after:2020-02-24",
        "repeat:every3days",
      ]);
      const expected = makeTask("A simple task", true, [
        "after:2020-02-27",
        "repeat:every3days",
      ]);
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it("Correctly adds 1 month to both by and after dates #mVwp7v", () => {
      const task = makeTask("An example task", true, [
        "after:2020-02-10",
        "by:2020-02-20",
        "repeat:every1month",
      ]);
      const expected = makeTask("An example task", true, [
        "after:2020-03-10",
        "by:2020-03-20",
        "repeat:every1month",
      ]);
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it("Correctly adds 3 years to by and after dates #DYtXLy", () => {
      const task = makeTask("An example task", true, [
        "after:2020-02-10",
        "by:2020-02-20",
        "repeat:every3year",
      ]);
      const expected = makeTask("An example task", true, [
        "after:2023-02-10",
        "by:2023-02-20",
        "repeat:every3year",
      ]);
      expect(setNextByAndAfterDates(task, today)).toEqual(expected);
    });

    it("Throws for a task without an after or by date #Ntbyrc", () => {
      const task = makeTask("An example without a date", false, [
        "repeat:every3days",
      ]);
      expect(() => setNextByAndAfterDates(task, today)).toThrow();
    });
  });

  describe("calculateNextIteration()", () => {
    it("Correctly calculates for by:2020-02-21 repeat:after3days #b2mYm5", () => {
      const task = makeTask("A simple task", true, [
        "by:2020-02-21",
        "repeat:after3days",
      ]);
      const expected = makeTask("A simple task", false, [
        "by:2020-02-27",
        "repeat:after3days",
      ]);
      expect(createNextRepetitionTask(task, today)).toEqual(expected);
    });

    it("Correctly calculates for by:2020-02-24 repeat:every3days #7jfVa5", () => {
      const task = makeTask("A simple task", true, [
        "by:2020-02-24",
        "repeat:every3days",
      ]);
      const expected = makeTask("A simple task", false, [
        "by:2020-02-27",
        "repeat:every3days",
      ]);
      expect(createNextRepetitionTask(task, today)).toEqual(expected);
    });

    it("Removes the finished field #HFcU0o", () => {
      const task = makeTask("A simple task", true, [
        "by:2020-02-21",
        "repeat:after3days",
        "finished:2020-02-24",
      ]);
      const expected = makeTask("A simple task", false, [
        "by:2020-02-27",
        "repeat:after3days",
      ]);
      expect(createNextRepetitionTask(task, today)).toEqual(expected);
    });
  });
});
