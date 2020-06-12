import { LocalDate } from "@js-joda/core";

export const today = LocalDate.of(2020, 2, 24);
export const yesterday = today.minusDays(1);
export const tomorrow = today.plusDays(1);
