/// <reference path="../../node_modules/@types/jest/index.d.ts"/>
import {
  getLeadingNumbers,
  isDay,
  isMonth,
  dayInputToDayOfWeek,
  monthsInputToMonthOfYear,
  getRepeatParams
} from "../repeat";

describe("getLeadingNumbers()", () => {
  it("Finds leading single digit number #qQcEbR", () => {
    expect(getLeadingNumbers("3foo")).toEqual([3]);
    expect(getLeadingNumbers("5bar")).toEqual([5]);
  });

  it("Finds leading 2 digit number #EN8YM9", () => {
    expect(getLeadingNumbers("35barsky")).toEqual([35]);
    expect(getLeadingNumbers("29barsky,one,five,seven")).toEqual([29]);
  });

  it("Finds comma separated numbers #0eytX9", () => {
    expect(getLeadingNumbers("1,2,3foo,bar,baz")).toEqual([1, 2, 3]);
  });

  it("Fails on number comma string #kq0XcV", () => {
    expect(() => getLeadingNumbers("1,foo")).toThrow();
  });

  describe("isDay", () => {
    it("Returns true for mon,wed,sun #UnJBQE", () => {
      expect(isDay("mon")).toEqual(true);
      expect(isDay("wed")).toEqual(true);
      expect(isDay("sun")).toEqual(true);
    });

    it("Returns false for MON,THU,FRI #fS20Mp", () => {
      expect(isDay("MON")).toEqual(false);
      expect(isDay("THU")).toEqual(false);
      expect(isDay("FRI")).toEqual(false);
    });
  });

  describe("isMonth", () => {
    it("Returns true for jan, mar, dec #4bmRUk", () => {
      expect(isMonth("jan")).toEqual(true);
      expect(isMonth("mar")).toEqual(true);
      expect(isMonth("dec")).toEqual(true);
    });

    it("Returns false for JAN, MAY, NOV #B7W81k", () => {
      expect(isMonth("JAN")).toEqual(false);
      expect(isMonth("MAY")).toEqual(false);
      expect(isMonth("NOV")).toEqual(false);
    });
  });

  describe("daysInputToDayOfWeek()", () => {
    it("Convers mon to MO #oNzhTr", () => {
      expect(dayInputToDayOfWeek("mon")).toEqual("MO");
      expect(dayInputToDayOfWeek("fri")).toEqual("FR");
      expect(dayInputToDayOfWeek("sun")).toEqual("SU");
    });
  });

  describe("monthsInputToMonthOfYear()", () => {
    it("Convers jan to 1, dec to 12 #dr6HL9", () => {
      expect(monthsInputToMonthOfYear("jan")).toEqual(1);
      expect(monthsInputToMonthOfYear("mar")).toEqual(3);
      expect(monthsInputToMonthOfYear("dec")).toEqual(12);
    });
  });

  describe("getRepeatParams()", () => {
    it("Correctly extracts after3weeks #6uCEaq", () => {
      expect(getRepeatParams("after3weeks")).toEqual({
        type: "simple",
        repeat: "after",
        unit: "week",
        count: 3
      });
    });

    it("Correctly extracts every12months #K4fFIz", () => {
      expect(getRepeatParams("every12months")).toEqual({
        type: "simple",
        repeat: "every",
        unit: "month",
        count: 12
      });
    });

    it("Correctly extracts every4days #jNzCPG", () => {
      expect(getRepeatParams("every4days")).toEqual({
        type: "simple",
        repeat: "every",
        unit: "day",
        count: 4
      });
    });

    it("Correctly extracts every3jan,apr,jul,oct #kzKbU5", () => {
      expect(getRepeatParams("every3jan,apr,jul,oct")).toEqual({
        type: "monthly",
        repeat: "every",
        dates: [3],
        months: [1, 4, 7, 10]
      });
    });

    it("Correctly extracts every1,4,10jan,apr,jul,oct #VzEda9", () => {
      expect(getRepeatParams("every1,4,10jan,apr,jul,oct")).toEqual({
        type: "monthly",
        repeat: "every",
        dates: [1, 4, 10],
        months: [1, 4, 7, 10]
      });
    });

    it("Correctly extracts everymon,tue,fri #Co2Et7", () => {
      expect(getRepeatParams("everymon,tue,fri")).toEqual({
        type: "weekly",
        repeat: "every",
        count: 1,
        days: ["MO", "TU", "FR"]
      });
    });

    it("Correctly extracts every2mon,tue #VrJCf3", () => {
      expect(getRepeatParams("every2mon,tue")).toEqual({
        type: "weekly",
        repeat: "every",
        count: 2,
        days: ["MO", "TU"]
      });
    });

    it("Throws for everyjan,feb,mar #8Pqgd2", () => {
      expect(() => getRepeatParams("everyjan,feb,mar")).toThrow();
    });

    it("Throws for every3mon,jan #KKW9pa", () => {
      expect(() => getRepeatParams("everymon,jan")).toThrow();
    });

    it("Throws for every3,10,12mon,jan #Kzk7Ym", () => {
      expect(() => getRepeatParams("everymon,jan")).toThrow();
    });

    it("Throws for everymon,jan #eYYxbz", () => {
      expect(() => getRepeatParams("everymon,jan")).toThrow();
    });
  });
});
