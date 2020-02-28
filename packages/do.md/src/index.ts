import { LocalDate } from "@js-joda/core";

export { repeatTasks } from "./repeat";
export { filterTasks } from "./filter";

export const today = (): LocalDate => {
  return LocalDate.now();
};
