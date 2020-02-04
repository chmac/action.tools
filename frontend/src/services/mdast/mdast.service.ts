import * as R from "remeda";
import unified from "unified";
import markdown from "remark-parse";
import visit from "unist-util-visit";
import map from "unist-util-map";
import { selectAll } from "unist-util-select";
import { Node } from "unist";

export const markdownToMdast = (text: string) => {
  return unified()
    .use(markdown, { gfm: true })
    .parse(text);
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

export const startup = () => {
  fetch("/do.md")
    .then(response => {
      return response.text();
    })
    .then(body => {
      return unified()
        .use(markdown, { gfm: true })
        .parse(body);
    })
    .then(tree => {
      return map(tree, (node: Node) => {
        if (isTask(node)) {
          return addData(node);
        }
        return node;
      });
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
