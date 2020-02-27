import * as git from "isomorphic-git";
import * as LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import * as path from "path";

const fs = new LightningFS("domd", { wipe: false });
const DIR = "/domd";
const FILE = "do.md";
const FILEPATH = path.join(DIR, FILE);

const AUTH_STORAGE_KEY = "__auth";

if (process.env.NODE_ENV === "development") {
  (window as any)["fs"] = fs;
}

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
    corsProxy: "https://cors.isomorphic-git.org",
    author: {
      name: "DoMd Browser",
      email: "dummy@domain.tld"
    },
    onAuth
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

export const getMarkdown = async (filepath: string = FILEPATH) => {
  try {
    await fs.promises.stat(filepath);
  } catch (error) {
    debugger;
  }

  return fs.promises.readFile(filepath, { encoding: "utf8" });
};

export const setMarkdown = async (
  markdown: string,
  filepath: string = FILEPATH
) => {
  alert("Starting save to Git #YpHeKm");
  try {
    await fs.promises.writeFile(filepath, markdown, { encoding: "utf8" });
  } catch (error) {
    debugger;
  }

  try {
    const status = await git.status(
      addBaseParams({
        filepath: FILE
      })
    );

    if (status === "unmodified") {
      return;
    }

    await git.add(
      addBaseParams({
        filepath: FILE
      })
    );

    await git.commit(
      addBaseParams({
        message: "Adding an update from the web"
      })
    );

    await git.push(addBaseParams({}));

    alert("Successfully saved and pushd #AIp4wO");
  } catch (error) {
    debugger;
  }
};
