import { InlineCode } from 'mdast';
import { DATA_KEYS, KEY_VALUE_SEPARATOR } from './constants';

export const identity = <T>(p: T): T => p;

export const isDataInlineCode = (input: InlineCode): boolean => {
  const [key] = input.value.split(KEY_VALUE_SEPARATOR);
  // NOTE: We need to coerce the type here otherwise .includes() complains
  return DATA_KEYS.includes(key as any);
};
