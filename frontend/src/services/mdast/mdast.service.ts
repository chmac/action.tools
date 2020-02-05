import * as R from "remeda";
import unified from "unified";
import markdown from "remark-parse";
import visit from "unist-util-visit";
import map from "unist-util-map";
import { selectAll } from "unist-util-select";
import { Node } from "unist";
import later from "later";
import dayjs from "dayjs";
import { Rule } from "../../rschedule";
import { RuleOption } from "@rschedule/core";

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
const MONTHS_TO_NUMBER: { [month: string]: number } = {
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

export const startsWith = (target: string, input: string): boolean => {
  return input.substr(0, target.length).toLowerCase() === target;
};

export const removeFromFront = (target: string, input: string): string => {
  if (!startsWith(target, input)) {
    return input;
  }
  return input.substr(target.length);
};

export const dayToRuleDay = (day: string): RuleOption.ByDayOfWeek => {
  if (!isDay(day)) {
    throw new Error("dayToRuleDay called with invalid day #TesvaG");
  }
  return day.substr(0, 2).toUpperCase() as RuleOption.ByDayOfWeek;
};

export const monthToRuleMonth = (month: string): RuleOption.ByMonthOfYear => {
  if (!isMonth(month)) {
    throw new Error("monthToRuleMonth called with invalid month #6rFg6u");
  }
  const lowerMonth = month.toLowerCase();
  return MONTHS_TO_NUMBER[lowerMonth] as RuleOption.ByMonthOfYear;
};

export const calculateNextOccurrence = (schedule: string, from: Date): Date => {
  if (startsWith(EVERY, schedule)) {
    const extendBy = removeFromFront(EVERY, schedule);
    if (startsWithANumber(extendBy)) {
      const { count, unit } = getCountAndUnitFromString(extendBy);
      return dayjs(from)
        .add(count, unit)
        .toDate();
    }

    const points = extendBy.split(",");

    const arePointsAllDays = points.every(isDay);
    const arePointsAllMonths = points.every(isMonth);
    if (!(arePointsAllDays || arePointsAllMonths)) {
      throw new Error("Invalid mixture of days and months #V0yUbX");
    }

    if (arePointsAllDays) {
      const rule = new Rule({
        frequency: "WEEKLY",
        byDayOfWeek: R.map(points, dayToRuleDay),
        start: from
      });
      const [next] = rule.occurrences({ start: from, take: 1 }).toArray();

      return new Date(next.toISOString());
    } else if (arePointsAllMonths) {
      const rule = new Rule({
        frequency: "YEARLY",
        byMonthOfYear: R.map(points, monthToRuleMonth),
        start: from
      });

      const [next] = rule.occurrences({ start: from, take: 1 }).toArray();

      return new Date(next.toISOString());
    }
  } else if (startsWith(AFTER, schedule)) {
    const extendBy = removeFromFront(AFTER, schedule);
    const { count, unit } = getCountAndUnitFromString(extendBy);
    return dayjs(from)
      .add(count, unit)
      .toDate();
  }
  throw new Error("Invalid repetition schedule #222CJy");
};
