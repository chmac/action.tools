import { Parent } from "unist";

const attacher = (settings: {}) => {
  const transformer = (tree: Parent, file: any) => {
    return;
  };

  return transformer;
};

export default attacher;
