export const REDUX_ROOT_KEY = '__domd';

export const EVERY = 'every' as const;
export const AFTER = 'after' as const;
export const BY = 'by' as const;
export const REPEAT = 'repeat' as const;
export const CREATED = 'created' as const;
export const FINISHED = 'finished' as const;
export const SNOOZE = 'snooze' as const;
export const KEY_VALUE_SEPARATOR = ':' as const;
export const TAG_PREFIX = '#' as const;
export const CONTEXT_PREFIX = '@' as const;
export const PROJECT_PREFIX = '+' as const;

export const DATA_KEYS = [AFTER, BY, CREATED, FINISHED, SNOOZE];

// Combine this with the key ("created", etc) to create a RegExp
export const KEY_VAR_REGEX_SUFFIX = `:[\\S]+`;
export const REGEX_SUFFIX = `[\\S]+`;

export const UNITS = ['month', 'day', 'week', 'year'] as const;
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;
export const MONTHS_TO_NUMBER = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
} as const;

export const ProjectRegex = new RegExp('@[\\w]+', 'g');

const KeyVarRegexSuffix = `:[\\S]+`;

export const RepeatRegex = new RegExp(`${REPEAT}${KeyVarRegexSuffix}`);

export const AfterRegex = new RegExp(`${AFTER}${KeyVarRegexSuffix}`);

export const BeforeRegex = new RegExp(`${BY}${KeyVarRegexSuffix}`);

export const CreatedRegex = new RegExp(`${CREATED}${KeyVarRegexSuffix}`);

export const LeadingNumberRegex = new RegExp(``);
