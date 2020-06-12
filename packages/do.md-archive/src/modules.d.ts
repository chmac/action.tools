declare module "mdast-util-heading-range" {
  import { Node, Parent } from "unist";
  interface Heading extends Parent {
    depth: number;
  }

  type TestFunction = (value: string, node: Heading) => boolean;

  export default function (
    tree: Parent,
    options:
      | {
          test: string | RegExp | TestFunction;
          ignoreFinalDefinitions?: boolean;
        }
      | TestFunction,
    onrun: (
      start: Heading,
      nodes: Node[],
      end: Node | null,
      scope: { parent: Parent; start: number; end: number | null }
    ) => Node | Node[]
  ): Node;
}
