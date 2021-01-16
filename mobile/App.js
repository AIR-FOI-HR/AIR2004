import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, NavigationContainer } from "@react-navigation/native";
import merge from "deepmerge";
import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";
import FlashMessage from "react-native-flash-message";
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";

import { setTheme } from "./store/actions/user";

import Navigation from "./navigation";
import store from "./store/index";

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const App = () => {
  const [globalTheme, setGlobalTheme] = useState();

  store.subscribe(() => {
    if (store.getState().userState.themePreference == null || store.getState().userState.themePreference == "systemDefault") {
      setGlobalTheme(Appearance.getColorScheme() == "light" ? CombinedDefaultTheme : CombinedDarkTheme);
    } else if (store.getState().userState.themePreference == "light") {
      setGlobalTheme(CombinedDefaultTheme);
    } else {
      setGlobalTheme(CombinedDarkTheme);
    }
  });

  useEffect(() => {
    getTheme();
  }, []);

  const getTheme = async () => {
    let themePref = null;
    try {
      themePref = await AsyncStorage.getItem("themePreference");
      console.log("THEME PREF ASYNC STORAGE", themePref);
      store.dispatch(setTheme(themePref));
    } catch (e) {}
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={globalTheme}>
        <NavigationContainer theme={globalTheme}>
          <Navigation />
        </NavigationContainer>
      </PaperProvider>
      <FlashMessage position="top" />
    </Provider>
  );
};

export default App;
