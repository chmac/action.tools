// import { describe } from 'jest'
import { markdownToMdast } from "./mdast.service";

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
});
