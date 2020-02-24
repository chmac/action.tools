/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import { LocalDate } from "@js-joda/core";

import { stringToLocalDate, setDateField } from "../dates";

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
});
