import * as git from "isomorphic-git";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import * as path from "path";

const fs = new LightningFS("domd", { wipe: true });
const DIR = "/domd";
const FILE = "do.md";
const filepath = path.join(DIR, FILE);

(window as any)["fs"] = fs;

export const addBaseParams = <T extends object>(
  opts: T
): T & { fs: any; http: typeof http; dir: string } => {
  return {
    ...opts,
    fs,
    http,
    dir: DIR,
    corsProxy: "https://cors.isomorphic-git.org",
    author: {
      name: "DoMd Browser",
      email: "dummy@domain.tld"
    }
  };
};

export const ensureDir = async (dir: string) => {
  try {
    await fs.promises.stat(dir);
  } catch (e) {
    try {
      await fs.promises.mkdir(DIR);
    } catch (error) {
      throw error;
    }
  }
};

export const startup = async () => {
  await ensureDir(DIR);

  // await git.setConfig(
  //   addBaseParams({
  //     path: "user.name",
  //     value: "DoMd Browser"
  //   })
  // );
  // await git.setConfig(
  //   addBaseParams({
  //     path: "user.email",
  //     value: "dummy@domain.tld"
  //   })
  // );

  await git.clone(
    addBaseParams({
      url: "https://github.com/chmac/do-test",
      ref: "master",
      singleBranch: false
    })
  );

  await git.pull(
    addBaseParams({
      ref: "master"
    })
  );
};

export const getMarkdown = async (filename: string = filepath) => {
  try {
    await fs.promises.stat(filename);
  } catch (error) {
    debugger;
  }

  return fs.promises.readFile(filename, { encoding: "utf8" });
};

export const setMarkdown = async (markdown: string) => {
  return;
};
