import ApolloClient, { Operation } from "apollo-boost";

import { getToken, userHasRole } from "./services/auth/auth.service";

const uri = process.env.REACT_APP_GRAPHQL_URL;

const client = new ApolloClient({
  uri,
  request: (operation: Operation) => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // TODO: Better role handling here.
        "x-hasura-role": userHasRole("admin") ? "admin" : "user"
      }
    });
  }
});

export default client;
