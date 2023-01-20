import React from "react";
import { Provider } from "react-redux";

import store from "./store";

import Routes from "./scenes/Routes/Routes.scene";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default App;
