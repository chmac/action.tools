#!/usr/bin/env node

import fs from "fs-extra";
import { repeatTasks } from "do.md";
import program from "commander";

import { getMdast, mdastToMarkdown } from "./services/mdast/mdast.service";

program
  .version("0.1.0")
  .option("-p, --peppers", "Add peppers")
  .option("-P, --pineapple", "Add pineapple")
  .option("-b, --bbq-sauce", "Add bbq sauce")
  .option(
    "-c, --cheese [type]",
    "Add the specified type of cheese [marble]",
    "marble"
  )
  .parse(process.argv);

getMdast().then(async root => {
  const newDoc = repeatTasks(root);
  await mdastToMarkdown(newDoc);
  console.log("Done");
});
