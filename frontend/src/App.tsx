import React from "react";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";

import apollo from "./apollo";
import store from "./store";

import Routes from "./scenes/Routes/Routes.scene";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={apollo}>
        <Routes />
      </ApolloProvider>
    </Provider>
  );
};

export default App;
