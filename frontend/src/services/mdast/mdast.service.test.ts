import MockDate from "mockdate";

// import { describe } from 'jest'
import {
  getTaskTitle,
  markdownToMdast,
  getAllTasksFromTree
} from "./mdast.service";

export const test = () => {};

const example = `
* [ ] Here's a top level task in a +Random project @home
* [ ] With another second task +ClearOut @work
  - A comment added to the second task
  - [ ] A sub task is also underneath the comment
`;

describe("todo.md", () => {
  describe("markdownToMdast #CSbVZJ", () => {
    it("matches snapshot", () => {
      const tree = markdownToMdast(example);
      expect(tree).toMatchSnapshot();
    });
  });

  describe("getAllTasksFromTree()", () => {
    it("Does not return the comment #oRaIwP", () => {
      const tree = markdownToMdast(example);
      const tasks = getAllTasksFromTree(tree);
      expect(tasks).toHaveLength(3);
    });
  });

  describe("getTaskTitle()", () => {
    it("Gets title with project and context #pMaXbr", () => {
      const tree = markdownToMdast(example);
      const [one, two, three] = getAllTasksFromTree(tree);
      expect(getTaskTitle(one)).toEqual(
        "Here's a top level task in a +Random project @home"
      );
      expect(getTaskTitle(two)).toEqual(
        "With another second task +ClearOut @work"
      );
      expect(getTaskTitle(three)).toEqual(
        "A sub task is also underneath the comment"
      );
    });
  });
});
