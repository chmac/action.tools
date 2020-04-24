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

    it("Trims out sibling headings without any sub tasks #Sqv5fV", () => {
      const input = u("root", [
        u("heading", { depth: 1 }, [u("text", "First heading")]),
        u("heading", { depth: 2 }, [u("text", "Empty h2")]),
        u("paragraph", [
          u("text", "Para below heading without a task should be stripped"),
        ]),
        u("heading", { depth: 2 }, [u("text", "Second repeat heading")]),
        u("list", { ordered: false, spread: false, start: null }, [
          u("listItem", { checked: false, spread: false }, [
            u("paragraph", [u("text", "This is a child task #JkmkMh")]),
          ]),
        ]),
      ]);
      const expected = u("root", [
        u("heading", { depth: 1 }, [u("text", "First heading")]),
        u("heading", { depth: 2 }, [u("text", "Second repeat heading")]),
        u("list", { ordered: false, spread: false, start: null }, [
          u("listItem", { checked: false, spread: false }, [
            u("paragraph", [u("text", "This is a child task #JkmkMh")]),
          ]),
        ]),
      ]);
      expect(trim(input)).toEqual(expected);
    });

    it("Removes empty aunty headers #NnowV7", () => {
      const input = u("root", [
        u("heading", { depth: 1 }, [u("text", "First heading")]),
        u("heading", { depth: 2 }, [u("text", "Empty h2")]),
        u("paragraph", [
          u("text", "Para below heading without a task should be stripped"),
        ]),
        u("heading", { depth: 3 }, [u("text", "Empty h3")]),
        u("paragraph", [
          u("text", "Grandchildren paragraphs should also be stripped"),
        ]),
        u("heading", { depth: 2 }, [u("text", "Second repeat heading")]),
        u("heading", { depth: 3 }, [u("text", "Grandchild heading")]),
        u("list", { ordered: false, spread: false, start: null }, [
          u("listItem", { checked: false, spread: false }, [
            u("paragraph", [u("text", "This is a child task #JkmkMh")]),
          ]),
        ]),
      ]);
      const expected = u("root", [
        u("heading", { depth: 1 }, [u("text", "First heading")]),
        u("heading", { depth: 2 }, [u("text", "Second repeat heading")]),
        u("heading", { depth: 3 }, [u("text", "Grandchild heading")]),
        u("list", { ordered: false, spread: false, start: null }, [
          u("listItem", { checked: false, spread: false }, [
            u("paragraph", [u("text", "This is a child task #JkmkMh")]),
          ]),
        ]),
      ]);
      expect(trim(input)).toEqual(expected);
    });

    it("Removes multiple empty siblings of the first heading #jc4SSk", () => {
      const input = u("root", [
        u("heading", { depth: 1 }, [u("text", "Top")]),
        u("heading", { depth: 2 }, [u("text", "First son")]),
        u("heading", { depth: 2 }, [u("text", "Second son")]),
        u("heading", { depth: 2 }, [u("text", "Third son")]),
        u("heading", { depth: 2 }, [u("text", "Fourth son")]),
        u("list", { ordered: false, spread: false, start: null }, [
          u("listItem", { checked: false, spread: false }, [
            u("paragraph", [u("text", "This is a child task #JkmkMh")]),
          ]),
        ]),
      ]);
      const expected = u("root", [
        u("heading", { depth: 1 }, [u("text", "Top")]),
        u("heading", { depth: 2 }, [u("text", "Fourth son")]),
        u("list", { ordered: false, spread: false, start: null }, [
          u("listItem", { checked: false, spread: false }, [
            u("paragraph", [u("text", "This is a child task #JkmkMh")]),
          ]),
        ]),
      ]);
      expect(trim(input)).toEqual(expected);
    });
  });
});
