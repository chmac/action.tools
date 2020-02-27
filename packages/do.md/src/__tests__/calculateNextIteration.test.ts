// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import { LocalDate } from "@js-joda/core";
import { advanceTo, clear } from "jest-date-mock";

import {
  nextDateOfIterationSimple,
  nextDateOfIterationWeekly,
  nextDateOfIterationMonthly,
  setNextByAndAfterDates,
  createNextRepetitionTask
} from "../calculateNextIteration";
import { makeTask } from "./__fixtures__/tasks.fixtures";

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
            unit: "day"
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
            unit: "week"
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
            unit: "month"
          },
          // NOTE: This is a leap year
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 5, 13));
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
            months: [1, 4, 7, 10]
          },
          LocalDate.of(2020, 2, 13)
        )
      ).toEqual(LocalDate.of(2020, 4, 1));
    });
  });

  describe("setNextByAndAfterDates()", () => {
    it("Correctly calculates for by:2020-02-21 repeat:after3days #hWLtrb", () => {
      const task = makeTask(
        "A simple task by:2020-02-21 repeat:after3days",
        true
      );
      const expected = makeTask(
        "A simple task by:2020-02-27 repeat:after3days",
        true
      );
      expect(setNextByAndAfterDates(task)).toEqual(expected);
    });

    it("Correctly calculates for by:2020-02-24 repeat:every3days #hWLtrb", () => {
      const task = makeTask(
        "A simple task by:2020-02-24 repeat:every3days",
        true
      );
      const expected = makeTask(
        "A simple task by:2020-02-27 repeat:every3days",
        true
      );
      expect(setNextByAndAfterDates(task)).toEqual(expected);
    });
  });

  describe("calculateNextIteration()", () => {
    it("Correctly calculates for by:2020-02-21 repeat:after3days #b2mYm5", () => {
      const task = makeTask(
        "A simple task by:2020-02-21 repeat:after3days",
        true
      );
      const expected = makeTask(
        "A simple task by:2020-02-27 repeat:after3days",
        false
      );
      expect(createNextRepetitionTask(task)).toEqual(expected);
    });

    it("Correctly calculates for by:2020-02-24 repeat:every3days #7jfVa5", () => {
      const task = makeTask(
        "A simple task by:2020-02-24 repeat:every3days",
        true
      );
      const expected = makeTask(
        "A simple task by:2020-02-27 repeat:every3days",
        false
      );
      expect(createNextRepetitionTask(task)).toEqual(expected);
    });

    it("Removes the finished field #HFcU0o", () => {
      const task = makeTask(
        "A simple task by:2020-02-21 repeat:after3days finished:2020-02-24",
        true
      );
      const expected = makeTask(
        "A simple task by:2020-02-27 repeat:after3days",
        false
      );
      expect(createNextRepetitionTask(task)).toEqual(expected);
    });
  });
});
