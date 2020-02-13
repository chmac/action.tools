import * as R from "remeda";

import { RuleOption } from "./rschedule";
import { Repeat, Day, Month, Unit } from "./types";
import { startsWith, removeFromFront } from "./utils";
import {
  EVERY,
  AFTER,
  MONTHS,
  DAYS,
  MONTHS_TO_NUMBER,
  UNITS
} from "./constants";

const leadingNumberRegex = new RegExp("^[\\d,]+");

export const getLeadingNumbers = (input: string): number[] => {
  const matches = input.match(leadingNumberRegex);

  if (matches === null) {
    return [];
  }

  if (matches.index !== 0) {
    throw new Error("Unknown error parsing repeat string #vX5cVc");
  }

  if (matches[0].substr(-1) === ",") {
    throw new Error("Error parsing repeat string. Too many commas. #Oew9pV");
  }

  const strings = matches[0].split(",");

  const numbers = R.map(strings, parseInt);

  return numbers;
};

export const isDay = (input: string): input is Day => {
  return DAYS.indexOf(input as Day) !== -1;
};

export const isMonth = (input: string): input is Month => {
  return MONTHS.indexOf(input as Month) !== -1;
};

export const isUnit = (input: string): input is Unit => {
  return UNITS.indexOf(input as Unit) !== -1;
};

export const dayInputToDayOfWeek = (input: Day): RuleOption.ByDayOfWeek => {
  return input.substr(0, 2).toUpperCase() as RuleOption.ByDayOfWeek;
};

export const monthsInputToMonthOfYear = (
  input: Month
): RuleOption.ByMonthOfYear => {
  return MONTHS_TO_NUMBER[input];
};

export const getRepeatParams = (input: string): Repeat => {
  const type = startsWith(EVERY, input)
    ? EVERY
    : startsWith(AFTER, input)
    ? AFTER
    : null;

  if (type === null) {
    throw new Error("Invalid repeat string #ITAWtF");
  }

  // Strip the leading every or after string
  const countAndUnit = removeFromFront(type, input);

  const numbers = getLeadingNumbers(countAndUnit);

  // NOTE: We convert to lower case here to ensure case insensitivity
  const unit = removeFromFront(numbers.join(","), countAndUnit).toLowerCase();

  const multpleUnits = unit.split(",");

  if (multpleUnits.length > 1) {
    if (type === AFTER) {
      throw new Error(
        "Invalid repeat string. Cannot mix after and multiple values. #Ah2i8c"
      );
    }

    if (multpleUnits.every(isDay)) {
      // TypeScript cannot infer from the `.every()` type predicate
      const days = (multpleUnits as Day[]).map(dayInputToDayOfWeek);
      // NOTE: We default to every 1 week if a number was not specified
      const count = numbers.length === 1 ? numbers[0] : 1;
      return {
        type,
        count,
        days
      };
    } else if (multpleUnits.every(isMonth)) {
      if (numbers.length === 0) {
        throw new Error("Invalid repeat string. No dates specified. #qBE8YE");
      }
      if (!numbers.every(date => date <= 31)) {
        throw new Error("Invalid repeat string. Date >31. #hciAdh");
      }

      // TypeScript cannot infer from the `.every()` type predicate
      const months = (multpleUnits as Month[]).map(monthsInputToMonthOfYear);
      return {
        type,
        dates: numbers,
        months
      };
    } else {
      throw new Error("Invalid repeat string #fJhZTU");
    }
  }

  const trimmedUnit = unit.replace(/s$/, "");

  if (!isUnit(trimmedUnit)) {
    throw new Error(
      `Invalid repeat string. Invalid unit: ${trimmedUnit}. #fL3bsD`
    );
  }

  const [count] = numbers;

  return {
    type,
    unit: trimmedUnit,
    count
  };
};
