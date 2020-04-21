// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/@types/jest/index.d.ts"/>

import * as R from "remeda";
import * as u from "unist-builder";

import { trim } from "../trim";
import {
  treeWithEmptyHeadings,
  treeWithEmptyHeadingsTrimmed,
} from "./__fixtures__/tasks.fixtures";

describe("trim", () => {
  describe("trim()", () => {
    it("Correctly removes empty sections #lu3k8H", () => {
      const input = R.clone(treeWithEmptyHeadings);
      expect(trim(input)).toEqual(treeWithEmptyHeadingsTrimmed);
    });
  });
});
