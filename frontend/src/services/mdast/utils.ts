import * as R from "remeda";
import dayjs from "dayjs";
import { RuleOption } from "@rschedule/core";

import { Rule } from "../../rschedule";
import {
  EVERY,
  AFTER,
  UNITS,
  DAYS,
  MONTHS,
  MONTHS_TO_NUMBER
} from "./mdast.service";

export const getNumberFromStart = (input: string): number => {
  const result = input.match(/^[\d]+/);
  if (!result || !result.length || !result[0]) {
    throw new Error("Failed to find number #1jMxvU");
  }
  const number = parseInt(result[0]);
  if (typeof number !== "number" || number <= 0) {
    throw new Error("Invalid number found #GPU80T");
  }
  return number;
};
export const isValidUnit = (unit: string): unit is dayjs.OpUnitType => {
  return UNITS.indexOf(unit) !== -1;
};

export const convertUnit = (unit: string) => {
  return unit.toLowerCase().replace(/s$/, "");
};

export const getCountAndUnitFromString = (
  input: string
): { count: number; unit: dayjs.OpUnitType } => {
  const result = input.match(/^([\d]+)([\w]+)$/);

  if (
    !result ||
    typeof result[1] !== "string" ||
    typeof result[2] !== "string"
  ) {
    throw new Error("Invalid recurrence string #LK6o80");
  }

  const [_, countString, unitResult] = result;

  const count = parseInt(countString);

  if (count <= 0) {
    throw new Error("Invalid count #E8DCQc");
  }

  const unit = convertUnit(unitResult);

  if (!isValidUnit(unit)) {
    throw new Error("Invalid unit specified #Fvk3ZI");
  }

  return {
    count,
    unit
  };
};

export const startsWithANumber = (input: string): boolean => {
  return !!input.match(/^\d/);
};

export const isDay = (input: string): boolean => {
  return DAYS.indexOf(input) !== -1;
};

export const isMonth = (input: string): boolean => {
  return MONTHS.indexOf(input) !== -1;
};
export const isValidPoint = (point: string) => {};

export const startsWith = (target: string, input: string): boolean => {
  return input.substr(0, target.length).toLowerCase() === target;
};

export const removeFromFront = (target: string, input: string): string => {
  if (!startsWith(target, input)) {
    return input;
  }
  return input.substr(target.length);
};

export const dayToRuleDay = (day: string): RuleOption.ByDayOfWeek => {
  if (!isDay(day)) {
    throw new Error("dayToRuleDay called with invalid day #TesvaG");
  }
  return day.substr(0, 2).toUpperCase() as RuleOption.ByDayOfWeek;
};

export const monthToRuleMonth = (month: string): RuleOption.ByMonthOfYear => {
  if (!isMonth(month)) {
    throw new Error("monthToRuleMonth called with invalid month #6rFg6u");
  }
  const lowerMonth = month.toLowerCase();
  return MONTHS_TO_NUMBER[lowerMonth] as RuleOption.ByMonthOfYear;
};

export const calculateNextOccurrence = (schedule: string, from: Date): Date => {
  if (startsWith(EVERY, schedule)) {
    const extendBy = removeFromFront(EVERY, schedule);
    if (startsWithANumber(extendBy)) {
      const { count, unit } = getCountAndUnitFromString(extendBy);
      return dayjs(from)
        .add(count, unit)
        .toDate();
    }

    const points = extendBy.split(",");

    const arePointsAllDays = points.every(isDay);
    const arePointsAllMonths = points.every(isMonth);
    if (!(arePointsAllDays || arePointsAllMonths)) {
      throw new Error("Invalid mixture of days and months #V0yUbX");
    }

    if (arePointsAllDays) {
      const rule = new Rule({
        frequency: "WEEKLY",
        byDayOfWeek: R.map(points, dayToRuleDay),
        start: from
      });
      const [next] = rule.occurrences({ start: from, take: 1 }).toArray();

      return new Date(next.toISOString());
    } else if (arePointsAllMonths) {
      const rule = new Rule({
        frequency: "YEARLY",
        byMonthOfYear: R.map(points, monthToRuleMonth),
        start: from
      });

      const [next] = rule.occurrences({ start: from, take: 1 }).toArray();

      return new Date(next.toISOString());
    }
  } else if (startsWith(AFTER, schedule)) {
    const extendBy = removeFromFront(AFTER, schedule);
    const { count, unit } = getCountAndUnitFromString(extendBy);
    return dayjs(from)
      .add(count, unit)
      .toDate();
  }
  throw new Error("Invalid repetition schedule #222CJy");
};
