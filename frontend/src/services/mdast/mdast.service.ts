import * as R from "remeda";
import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import visit from "unist-util-visit";
import map from "unist-util-map";
import modifyChildren from "unist-util-modify-children";
import toString from "mdast-util-to-string";
import { selectAll } from "unist-util-select";
import { Node, Parent } from "unist";

export type NodeWithData = Node & { _data: { [prop: string]: any } };

export const EVERY = "every";
export const AFTER = "after";
export const UNITS = ["month", "day", "week"];
export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];
export const MONTHS_TO_NUMBER: { [month: string]: number } = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
};

export const markdownToMdast = (text: string): Parent => {
  return unified()
    .use(markdown, { gfm: true })
    .parse(text) as Parent;
};

export const mdastToMarkdown = async (tree: Parent): Promise<string> => {
  return unified()
    .use(stringify, {
      listItemIndent: "1"
    })
    .stringify(tree);
};

export const isTask = (node: Node) => {
  return node.type === "listItem" && typeof node.checked === "boolean";
};

export const getAllTasksFromTree = (tree: Node) => {
  const listItems = selectAll("listItem", tree);
  return R.filter(listItems, isTask);
};

export const getTopLevelTasksFromTree = (tree: Node) => {
  const listItems = selectAll(":root > list > listItem", tree);
  return R.filter(listItems, isTask);
};

export const getTaskTitle = (task: Node) => {
  return R.map(
    selectAll(":root > paragraph > text", task),
    R.prop("value")
  ).join(" ");
};

const addField = (name: string, getter: (node: Node) => any) => (
  tasks: Node[]
) => {
  return R.map(tasks, task => R.addProp(task, name, getter(task)));
};

const addTitles = addField("title", getTaskTitle);

const ProjectRegex = new RegExp("@[\\w]+", "g");

export const getProjectsFromText = (texts: string[]): string[] => {
  const matches = R.flatMap(texts, text => {
    return text.match(ProjectRegex) || [];
  });
  return R.map(matches, match => match.substr(1));
};

const addProjects = addField("projects", (task: Node): string[] => {
  const matches = getProjectsFromText([(task as any).title]);
  return R.map(matches, match => match.substr(1));
});

export const buildDataForTask = (task: Node) => {
  const title = getTaskTitle(task);
  const projects = getProjectsFromText([title]);
  return { title, projects };
};

export const addData = (task: Node) => {
  return R.addProp(task, "_data", buildDataForTask(task));
};

export const addProcessedToData = (node: NodeWithData) => {
  const { _data, ...rest } = node;
  return { _data: R.addProp(_data, "processed", true), ...rest };
};

export const startup = () => {
  fetch("/do.md")
    .then(response => {
      return response.text();
    })
    .then(body => {
      return markdownToMdast(body);
      // return unified()
      //   .use(markdown, { gfm: true })
      //   .parse(body);
    })
    // .then(tree => {
    //   const processor = unified().use(stringify, { listItemIndent: "1" });
    //   const md = processor.stringify(tree);
    //   return tree;
    // })
    .then(tree => {
      return map(tree, (node: Node) => {
        if (isTask(node)) {
          return addData(node);
        }
        return node;
      });
    })
    .then(treeWithData => {
      const modifier = (node: NodeWithData, index: number, parent: Parent) => {
        console.log("node #YQGjFr", node);
        if (node.type === "listItem") {
          const markdown = <string>toString(node);
          if (
            markdown.match(/inbox need to be filed/) &&
            !node._data.processed
          ) {
            const currentNode = addProcessedToData(R.clone(node));
            const { _data, ...rest } = R.clone(node);
            const newNode = {
              _data: R.addProp(_data, "inserted", true),
              ...rest
            };
            parent.children.splice(index, 1, newNode, currentNode);
            debugger;
          }
        }
      };

      const applyModify = modifyChildren(modifier);

      visit(treeWithData, "list", (node, index, parent) => {
        applyModify(node);
      });

      return treeWithData;
    })
    .then(treeWithDAta => {
      debugger;
      // const allTasks = R.pipe(getAllTasksFromTree(tree), R.map(addData));

      // const topTasks = R.pipe(getTopLevelTasksFromTree(tree), R.map(addData));

      debugger;
    });
};

const filterChildrenByType = (
  list: { type: string; children: any[] }[],
  type: string
) => {
  return R.filter(list, i => i.type === type);
};

const getParaTextFromTask = (task: any) => {};

const treeToActions = (tree: any) => {
  const lists: any[] = filterChildrenByType(tree.children, "list");

  R.forEach(lists, list => {
    const items = filterChildrenByType(list.children, "listItem");
    R.forEach(items, item => {
      const itemParagraphs: any = filterChildrenByType(
        item.children,
        "paragraph"
      );
      const itemTexts = R.map(itemParagraphs, (itemParagraph: any) => {
        return filterChildrenByType(itemParagraph.children, "text");
      });
      debugger;
    });
  });
};
