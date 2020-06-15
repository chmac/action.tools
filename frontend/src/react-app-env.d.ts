/// <reference types="react-scripts" />

declare module "unist-util-modify-children";
declare module "mdast-util-to-string";
declare module "remark-rehype";
// declare module "mdast-util-to-hast";
declare module "mdast-util-to-hast/lib/handlers/list-item";
declare module "mdast-util-to-hast/lib/handlers/list";
declare module "react-markdown/lib/renderers";

declare module "remark-react";

declare module "rehype-react" {
  import { Plugin } from "unified";

  const rehype2react: Plugin;

  export default rehype2react;
}

declare module "@isomorphic-git/lightning-fs";
