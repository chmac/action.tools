// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import { LocalDate } from "@js-joda/core";

import {
  stringToLocalDate,
  isTodayOrInTheFuture,
  isTodayOrInThePast
} from "../dates";

import { yesterday, today, tomorrow } from "./__fixtures__/dates.fixtures";

describe("dates", () => {
  describe("stringToDate()", () => {
    it("Correctly parses 2020-02-13 #hbvp4Z", () => {
      expect(stringToLocalDate("2020-02-13")).toEqual(
        LocalDate.of(2020, 2, 13)
      );
    });

    it("Throws for 2020_02_13 #mDtJ8r", () => {
      expect(() => stringToLocalDate("2020_02_13")).toThrow();
    });
  });

  describe("isTodayOrInTheFuture()", () => {
    it("Returns false for yesterday #U2V17I", () => {
      expect(isTodayOrInTheFuture(yesterday, today)).toEqual(false);
    });

    it("Returns true for today #JdBokK", () => {
      expect(isTodayOrInTheFuture(today, today)).toEqual(true);
    });

    it("Returns true for tomorrow #O4sCFt", () => {
      expect(isTodayOrInTheFuture(tomorrow, today)).toEqual(true);
    });
  });

  describe("isTodayOrInThePast()", () => {
    it("Returns true for yesterday #TYlScj", () => {
      expect(isTodayOrInThePast(yesterday, today)).toEqual(true);
    });

    it("Returns true for today #hrpoH8", () => {
      expect(isTodayOrInThePast(today, today)).toEqual(true);
    });

    it("Returns false for tomorrow #EEsCyz", () => {
      expect(isTodayOrInThePast(tomorrow, today)).toEqual(false);
    });
  });
});
