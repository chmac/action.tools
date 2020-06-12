import { LocalDate, DateTimeFormatter } from "@js-joda/core";

import { Task } from "./types";
import { getKeyValue, setKeyValue } from "./utils";

export const stringToLocalDate = (input: string): LocalDate => {
  return LocalDate.parse(input);
};

export const localDateToString = (date: LocalDate): string => {
  return date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
};

export const getDateField = (key: string, task: Task): LocalDate => {
  return stringToLocalDate(getKeyValue(key, task));
};

export const setDateField = (
  key: string,
  date: LocalDate,
  task: Task
): Task => {
  const dateString = localDateToString(date);
  return setKeyValue(key, dateString, task);
};

export const isTodayOrInTheFuture = (
  input: LocalDate,
  today: LocalDate
): boolean => {
  return input.compareTo(today) >= 0;
};

export const isTodayOrInThePast = (
  input: LocalDate,
  today: LocalDate
): boolean => {
  return input.compareTo(today) <= 0;
};
