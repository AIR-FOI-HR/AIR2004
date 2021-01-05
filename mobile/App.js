import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import userReducer from "./reducers/user";
import Navigation from "./navigation";
import signInOutMiddleware from "./middleware/signInOut";

import FlashMessage from "react-native-flash-message";

const store = createStore(userReducer, applyMiddleware(signInOutMiddleware));

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "rgb(255, 255, 255)",
  },
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer theme={AppTheme}>
          <Navigation />
        </NavigationContainer>
      </PaperProvider>
      <FlashMessage position="top" />
    </Provider>
  );
};

export default App;
