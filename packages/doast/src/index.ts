import { Content, Heading, PhrasingContent, Root } from 'mdast';

const isHeading = (node: any): node is Heading => {
  return node.type === 'heading';
};

export const nestContentsInsideHeadings = (root: Root): Root => {
  const { children } = root;

  let lastHeading: Heading | undefined = undefined;
  let output: Content[] = [];

  children.forEach(node => {
    // If this node is a heading, rename children to contents, and save this
    // heading into lastHeading so we know on the next pass that we found a
    // heading already
    if (isHeading(node)) {
      const heading = { ...node, contents: node.children, children: [] };
      lastHeading = heading;
      output.push(heading);
    } else {
      if (typeof lastHeading === 'undefined') {
        output.push(node);
      } else {
        lastHeading.children.push(node as PhrasingContent);
      }
    }
  });

  return { ...root, children: output };
};

export const convertNestedHeadingsToHierarchy = (root: Root): Root => {
  const { children } = root as { children: Heading[] };

  let output: Content[] = [];
  let lastHeading: Heading;

  children.forEach(node => {
    // If this is the first heading we see, push it to output. We don't have any
    // existing headings in output so we can't nest it inside anything.
    if (typeof lastHeading === 'undefined') {
      output.push(node);
      if (isHeading(node)) {
        lastHeading = node;
      }
      return;
    }

    // Anything that is not a heading should be pushed into output as is
    if (!isHeading(node)) {
      output.push(node);
      return;
    }

    // If this heading is a lower level (higher depth) than the last heading, we
    // want to make this heading a child of the last heading
    if (node.depth > lastHeading.depth) {
      lastHeading.children.push((node as unknown) as PhrasingContent);
    } else {
      // If this heading is at the same level, or a higher level, then we simply
      // push it into the output as a sibling to the last node
      output.push(node);
    }

    lastHeading = node;
  });

  return { ...root, children: output };
};

export const mdastToDoast = (root: Root): Root => {
  return convertNestedHeadingsToHierarchy(nestContentsInsideHeadings(root));
};
