import ApolloClient, { Operation } from "apollo-boost";

const uri = process.env.REACT_APP_GRAPHQL_URL;

const client = new ApolloClient({
  uri,
  request: (operation: Operation) => {
    operation.setContext({
      headers: {}
    });
  }
});

export default client;
