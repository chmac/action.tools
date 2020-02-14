/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import { LocalDate, TemporalQueries } from "@js-joda/core";

import {
  nextDateOfIterationSimple,
  nextDateOfIterationWeekly,
  nextDateOfIterationMonthly,
  localDateToZonedDateTime
} from "../calculateNextIteration";

describe("calculateNextIteration", () => {
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
});
