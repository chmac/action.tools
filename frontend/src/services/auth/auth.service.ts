import Auth0Lock from "auth0-lock";

import store from "../../store";
import { loginSuccessful, logoutActionCreator } from "./auth.state";

const client_id = process.env.REACT_APP_AUTH0_CLIENT_ID;
const domain = process.env.REACT_APP_AUTH0_DOMAIN;

const TOKEN_STORAGE_KEY = "_authToken";
const USER_ID_STORAGE_KEY = "_userId";
const ROLES_STORAGE_KEY = "_roles";

if (!client_id || !domain) {
  throw new Error("Missing Auth0 client_id or domain #SLARUm");
}

const lock = new Auth0Lock(client_id, domain, {
  auth: {
    responseType: "token",
    redirect: false,
    redirectUrl: `${window.location.protocol}//${window.location.host}`
  }
});

/*
lock.on("authorization_error", error => {
  debugger;
});
lock.on("unrecoverable_error", error => {
  debugger;
});
*/

lock.on("authenticated", (authResult: AuthResult) => {
  const userId = authResult.idTokenPayload.sub;
  const roles = (authResult.idTokenPayload as any)[
    "https://hasura.io/jwt/claims"
  ]["x-hasura-allowed-roles"];

  localStorage.setItem(TOKEN_STORAGE_KEY, authResult.idToken);
  localStorage.setItem(USER_ID_STORAGE_KEY, userId);

  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));

  store.dispatch(loginSuccessful(userId, roles));
});

export const showLock = () => {
  lock.show();
};

export const logout = () => {
  localStorage.clear();
  store.dispatch(logoutActionCreator());
  lock.logout({ returnTo: "http://localhost:3000/" });
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_STORAGE_KEY);
};

export const getRoles = (): string[] => {
  return JSON.parse(localStorage.getItem(ROLES_STORAGE_KEY) || `["user"]`);
};

export const userHasRole = (role: string) => {
  const roles = getRoles();
  return roles.indexOf(role) !== -1;
};

// We need to re-read these from `localStorage` on startup to ensure that our
// redux store is kept up to date.
const startup = () => {
  const userId = getUserId();
  const roles = getRoles();
  if (!!userId && !!roles && roles.length > 0)
    store.dispatch(loginSuccessful(userId, roles));
};
startup();
