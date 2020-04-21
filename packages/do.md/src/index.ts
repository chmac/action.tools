import { LocalDate } from "@js-joda/core";

export { repeatTasks } from "./repeat";
export { filterTasks } from "./filter";
export { countTasks } from "./count";
export { trim } from "./trim";

export const today = (): LocalDate => {
  return LocalDate.now();
};
