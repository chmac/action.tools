import * as git from "isomorphic-git";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import * as path from "path";
import { push, pushError } from "../notifications/notifications.service";

const DIR = "/domd";
const FILE = "do.md";
const FILEPATH = path.join(DIR, FILE);

const AUTH_STORAGE_KEY = "__auth";
const NAME_KEY = "name";
const EMAIL_KEY = "email";
const REPO_KEY = "repo";
const WIPE_ON_START_KEY = "__wipeOnStart";

const shouldWipe = window.localStorage.getItem(WIPE_ON_START_KEY) === "true";
if (shouldWipe) {
  window.localStorage.removeItem(WIPE_ON_START_KEY);
}

const fs = new LightningFS("domd", { wipe: shouldWipe });

if (process.env.NODE_ENV === "development") {
  (window as any)["fs"] = fs;
}

export const wipe = () => {
  window.localStorage.clear();
  window.localStorage.setItem(WIPE_ON_START_KEY, "true");
  window.location.reload();
};

export const getAuth = ():
  | { username: string; password: string }
  | undefined => {
  const authJson = localStorage.getItem(AUTH_STORAGE_KEY) || undefined;
  if (typeof authJson === "undefined") {
    return;
  }
  return JSON.parse(authJson);
};

export const saveAuth = (auth: { username: string; password: string }) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

const onAuth = () => {
  const auth = getAuth();
  if (typeof auth !== "undefined") {
    return auth;
  }

  if (window.confirm("Password required. Provide now?")) {
    const username = window.prompt("Username") || "";
    const password = window.prompt("Password") || "";

    if (username.length > 0 && password.length > 0) {
      const auth = { username, password };
      saveAuth(auth);
      return auth;
    }
    return { cancel: true };
  }
};

export const addBaseParams = <T extends object>(
  opts: T
): T & { fs: typeof fs; http: typeof http; dir: string } => {
  return {
    ...opts,
    fs,
    http,
    dir: DIR,
    author: {
      name: localStorage.getItem(NAME_KEY) || "",
      email: localStorage.getItem(EMAIL_KEY) || "",
    },
    onAuth,
  };
};

export const ensureDir = async (dir: string) => {
  try {
    await fs.promises.stat(dir);
  } catch (e) {
    if (e.code === "ENOENT" || e.code === "ENOTDIR") {
      try {
        await fs.promises.mkdir(DIR);
      } catch (error) {
        pushError({ message: "Error creating directory. #aeXYXA", error });
        throw error;
      }
    } else {
      pushError({
        message: "Error checking directory exists. #aGmoMT",
        error: e,
      });
      throw e;
    }
  }
};

export const startup = async () => {
  const name = localStorage.getItem(NAME_KEY) || "";
  const email = localStorage.getItem(EMAIL_KEY) || "";
  const repo = localStorage.getItem(REPO_KEY) || "";
  if (name.length === 0 || email.length === 0 || repo.length === 0) {
    const name = window.prompt("Set your name for Git commits #8Q2DAI") || "";
    const email = window.prompt("Set your email for Git commits #5hOmjM") || "";
    const repo = window.prompt("Set your Git Repo #vr2VCA", "") || "";
    if (name.length === 0 || email.length === 0 || repo.length === 0) {
      throw new Error("Invalid. Reload. #t7aV6R");
    }
    window.localStorage.setItem(NAME_KEY, name);
    window.localStorage.setItem(EMAIL_KEY, email);
    window.localStorage.setItem(REPO_KEY, repo);
  }

  push({ message: "Starting git fetch #l16Pys", type: "info" });

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

  try {
    await git.clone(
      addBaseParams({
        url: localStorage.getItem(REPO_KEY) || "",
        ref: "master",
        singleBranch: false,
      })
    );
  } catch (error) {
    // Clones might fail if it has already succeeded, so these errors can be
    // swallowed. Surface them to the user just because...
    pushError({
      message: `Git clone error. #SWAnZr`,
      error,
    });
  }

  await git.pull(
    addBaseParams({
      ref: "master",
    })
  );

  push({ message: "Finished git fetch #0zDbhW", type: "success" });
};

export const getMarkdown = async (filepath: string = FILEPATH) => {
  try {
    await fs.promises.stat(filepath);
  } catch (error) {
    pushError({ message: "Error reading file. #5eY1Tt", error });
    throw error;
  }

  return fs.promises.readFile(filepath, { encoding: "utf8" });
};

export const setMarkdown = async (
  markdown: string,
  filepath: string = FILEPATH
) => {
  push({ message: "Starting save to Git #YpHeKm", type: "info" });
  try {
    await fs.promises.writeFile(filepath, markdown, { encoding: "utf8" });
  } catch (error) {
    pushError({ message: "Error writing file. #hdHKDu", error });
    throw error;
  }

  try {
    const status = await git.status(
      addBaseParams({
        filepath: FILE,
      })
    );

    if (status === "unmodified") {
      push({ message: "No changes to commit. #rA9DxX", type: "info" });
      return;
    }

    await git.add(
      addBaseParams({
        filepath: FILE,
      })
    );

    await git.commit(
      addBaseParams({
        message: "Adding an update from the web",
      })
    );

    await git.push(addBaseParams({}));

    push({
      message: "Successfully saved and pushed #AIp4wO",
      type: "success",
    });
  } catch (error) {
    debugger;
  }
};
