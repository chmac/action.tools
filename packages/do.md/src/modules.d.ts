declare module 'mdast-util-to-string' {
  import { Node } from 'unist';
  const toString: (input: Node) => string;
  export default toString;
}
