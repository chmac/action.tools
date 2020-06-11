import { Parent } from "unist";
import { LocalDate } from "@js-joda/core";

// Plan
// - Take in an mdast
// - Convert it to a doast
// - Convert it back

interface Task extends Parent {
  type: "task";
  dates: {
    after?: LocalDate;
    by?: LocalDate;
    snooze?: LocalDate;
    created?: LocalDate;
    finished?: LocalDate;
  };
  data: {
    hasChildTasks: boolean;
  };
}

const attacher = (settings: {}) => {
  const transformer = (tree: Parent, file: any) => {
    return;
  };

  return transformer;
};

export default attacher;
