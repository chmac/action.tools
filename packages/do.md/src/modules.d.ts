declare module 'unist-util-remove-position' {
  import { Node } from 'unist';
  const removePosition: <T extends Node>(node: T, force?: boolean) => T;
  export default removePosition;
}

declare module 'mdast-util-to-string' {
  import { Node } from 'unist';
  const toString: (input: Node) => string;
  export default toString;
}
