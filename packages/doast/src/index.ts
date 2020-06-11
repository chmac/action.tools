import {
  Content,
  Heading,
  InlineCode,
  ListItem,
  PhrasingContent,
  Root,
} from 'mdast';
import compact from 'mdast-util-compact';
import reduce from 'unist-util-reduce';
import { DATA_KEYS, KEY_VALUE_SEPARATOR } from './constants';

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

const isInlineCode = (input: any): input is InlineCode => {
  return input.type === 'inlineCode';
};

const isDataInlineCode = (input: InlineCode): boolean => {
  const [key] = input.value.split(KEY_VALUE_SEPARATOR);
  // NOTE: We need to coerce the type here otherwise .includes() complains
  return DATA_KEYS.includes(key as any);
};

const isListItem = (input: any): input is ListItem => {
  return input.type === 'listItem';
};

export const listItemToTask = (input: ListItem): ListItem => {
  const inlineCodeDataBlocks: InlineCode[] = [];

  const reduced = reduce(input, node => {
    if (isInlineCode(node) && isDataInlineCode(node)) {
      inlineCodeDataBlocks.push(node);
      return [];
    }
    return node;
  });

  const pairs = inlineCodeDataBlocks.map(inlineCode => {
    const [key, ...rest] = inlineCode.value.split(':');
    return [key, rest.join(':')];
  });
  const data = Object.fromEntries(pairs);

  const lastNodeIndex = reduced.children.length - 1;
  const lastNode = reduced.children[lastNodeIndex];
  if (lastNode.type === 'thematicBreak') {
    reduced.children.splice(lastNodeIndex, 1);
  }

  const task = { ...reduced, data };

  return compact(task);
};

export const convertListItemsToTasks = (root: Root): Root => {
  return reduce(root, node => {
    if (isListItem(node) && typeof node.checked === 'boolean') {
      return listItemToTask(node);
    }
    return node;
  });
};

export const mdastToDoast = (root: Root): Root => {
  return convertNestedHeadingsToHierarchy(nestContentsInsideHeadings(root));
};
