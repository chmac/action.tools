import * as R from "remeda";
import unified from "unified";
import markdown from "remark-parse";
import visit from "unist-util-visit";
import map from "unist-util-map";
import { selectAll } from "unist-util-select";
import { Node } from "unist";
import later from "later";
import dayjs from "dayjs";

const EVERY = "every";
const AFTER = "after";
const UNITS = ["month", "day", "week"];
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const MONTHS = [
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
      const foo = later.parse.text("every monday,tuesday");
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

export const getNumberFromStart = (input: string): number => {
  const result = input.match(/^[\d]+/);
  if (!result || !result.length || !result[0]) {
    throw new Error("Failed to find number #1jMxvU");
  }
  const number = parseInt(result[0]);
  if (typeof number !== "number" || number <= 0) {
    throw new Error("Invalid number found #GPU80T");
  }
  return number;
};

export const isValidUnit = (unit: string): unit is dayjs.OpUnitType => {
  return UNITS.indexOf(unit) !== -1;
};

const convertUnit = (unit: string) => {
  return unit.toLowerCase().replace(/s$/, "");
};

export const getCountAndUnitFromString = (
  input: string
): { count: number; unit: dayjs.OpUnitType } => {
  const result = input.match(/^([\d]+)([\w]+)$/);

  if (
    !result ||
    typeof result[1] !== "string" ||
    typeof result[2] !== "string"
  ) {
    throw new Error("Invalid recurrence string #LK6o80");
  }

  const [_, countString, unitResult] = result;

  const count = parseInt(countString);

  if (count <= 0) {
    throw new Error("Invalid count #E8DCQc");
  }

  const unit = convertUnit(unitResult);

  if (!isValidUnit(unit)) {
    throw new Error("Invalid unit specified #Fvk3ZI");
  }

  return {
    count,
    unit
  };
};

export const startsWithANumber = (input: string): boolean => {
  return !!input.match(/^\d/);
};

export const isDay = (input: string): boolean => {
  return DAYS.indexOf(input) !== -1;
};

export const isMonth = (input: string): boolean => {
  return MONTHS.indexOf(input) !== -1;
};
export const isValidPoint = (point: string) => {};

export const calculateNextOccurrence = (schedule: string, from: Date): Date => {
  if (schedule.substr(0, EVERY.length) === EVERY) {
    const extendBy = schedule.substr(EVERY.length);

    if (startsWithANumber(extendBy)) {
      const { count, unit } = getCountAndUnitFromString(extendBy);
      return dayjs(from)
        .add(count, unit)
        .toDate();
    }

    const points = extendBy.split(",");
    if (!points.every(isDay) || !points.every(isMonth)) {
      throw new Error("Invalid mixture of days and months #V0yUbX");
    }

    const compiledSchedules = later.parse.text(`on ${points.join(", ")}`);
    const [next] = later
      .schedule({
        schedules: compiledSchedules
      })
      .next(1, from);
    return next;
  } else if (schedule.substr(0, AFTER.length) === AFTER) {
    const extendBy = schedule.substr(AFTER.length);
    const { count, unit } = getCountAndUnitFromString(extendBy);
    return dayjs(from)
      .add(count, unit)
      .toDate();
  }
  throw new Error("Invalid repetition schedule #222CJy");
};
