import * as R from 'remeda';
import {
  DAYS,
  UNITS,
  MONTHS,
  AFTER,
  EVERY,
  MONTHS_TO_NUMBER,
} from '../../../../constants';
import { Day, Month, Unit, Repeat } from '../../../../types';
import { RuleOption } from '../../../../rschedule';

const leadingNumberRegex = new RegExp('^[\\d,]+');

export const startsWith = (target: string, input: string): boolean => {
  return input.substr(0, target.length).toLowerCase() === target;
};

export const removeFromFront = (target: string, input: string): string => {
  if (!startsWith(target, input)) {
    return input;
  }
  return input.substr(target.length);
};

export const getLeadingNumbers = (input: string): number[] => {
  const matches = input.match(leadingNumberRegex);

  if (matches === null) {
    return [];
  }

  if (matches.index !== 0) {
    throw new Error('Unknown error parsing repeat string #vX5cVc');
  }

  if (matches[0].substr(-1) === ',') {
    throw new Error('Error parsing repeat string. Too many commas. #Oew9pV');
  }

  const strings = matches[0].split(',');

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

export const isDayOfMonth = (
  input: number
): input is RuleOption.ByDayOfMonth => {
  return typeof input === 'number' && input >= -31 && input <= 31;
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
  const repeat = startsWith(EVERY, input)
    ? EVERY
    : startsWith(AFTER, input)
    ? AFTER
    : null;

  if (repeat === null) {
    throw new Error('Invalid repeat string #ITAWtF');
  }

  // Strip the leading every or after string
  const countAndUnit = removeFromFront(repeat, input);

  const numbers = getLeadingNumbers(countAndUnit);

  // NOTE: We convert to lower case here to ensure case insensitivity
  const unit = removeFromFront(numbers.join(','), countAndUnit).toLowerCase();

  if (isDay(unit)) {
    if (repeat === AFTER) {
      throw new Error(
        'Invalid repeat string. Cannot mix after and multiple values. #psuDCi'
      );
    }
    const days = [dayInputToDayOfWeek(unit)];
    const count = numbers.length === 1 ? numbers[0] : 1;
    return {
      type: 'weekly',
      repeat,
      count,
      days,
    };
  }

  const multpleUnits = unit.split(',');

  if (multpleUnits.length > 1) {
    if (repeat === AFTER) {
      throw new Error(
        'Invalid repeat string. Cannot mix after and multiple values. #Ah2i8c'
      );
    }

    if (multpleUnits.every(isDay)) {
      // TypeScript cannot infer from the `.every()` type predicate
      const days = (multpleUnits as Day[]).map(dayInputToDayOfWeek);
      // NOTE: We default to every 1 week if a number was not specified
      const count = numbers.length === 1 ? numbers[0] : 1;
      return {
        type: 'weekly',
        repeat,
        count,
        days,
      };
    } else if (multpleUnits.every(isMonth)) {
      if (numbers.length === 0) {
        throw new Error('Invalid repeat string. No dates specified. #qBE8YE');
      }
      if (!numbers.every(isDayOfMonth)) {
        throw new Error('Invalid repeat string. Date >31. #hciAdh');
      }

      // TypeScript cannot infer from the `.every()` type predicate
      const months = (multpleUnits as Month[]).map(monthsInputToMonthOfYear);

      return {
        type: 'monthly',
        repeat,
        // TypeScript cannot infer from the `.every()` type predicate
        dates: numbers as RuleOption.ByDayOfMonth[],
        months,
      };
    } else {
      throw new Error('Invalid repeat string #fJhZTU');
    }
  }

  const trimmedUnit = unit.replace(/s$/, '');

  if (!isUnit(trimmedUnit)) {
    throw new Error(
      `Invalid repeat string. Invalid unit: ${trimmedUnit}. #fL3bsD`
    );
  }

  const [count] = numbers;

  return {
    type: 'simple',
    repeat,
    unit: trimmedUnit,
    count,
  };
};
