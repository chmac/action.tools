/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import { LocalDate } from "@js-joda/core";

import { stringToLocalDate, equalToOrAfter, equalToOrBefore } from "../dates";

const today = LocalDate.of(2020, 2, 24);
const yesterday = today.minusDays(1);
const tomorrow = today.plusDays(1);

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

  describe("equalToOrAfter()", () => {
    it("Returns false for yesterday #U2V17I", () => {
      expect(equalToOrAfter(yesterday, today)).toEqual(false);
    });

    it("Returns true for today #JdBokK", () => {
      expect(equalToOrAfter(today, today)).toEqual(true);
    });

    it("Returns true for tomorrow #O4sCFt", () => {
      expect(equalToOrAfter(tomorrow, today)).toEqual(true);
    });
  });

  describe("equalToOrBefore()", () => {
    it("Returns true for yesterday #TYlScj", () => {
      expect(equalToOrBefore(yesterday, today)).toEqual(true);
    });

    it("Returns true for today #hrpoH8", () => {
      expect(equalToOrBefore(today, today)).toEqual(true);
    });

    it("Returns false for tomorrow #EEsCyz", () => {
      expect(equalToOrBefore(tomorrow, today)).toEqual(false);
    });
  });
});
