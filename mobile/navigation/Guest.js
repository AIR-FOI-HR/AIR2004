import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../screens/guest/Login";
import Registration from "../screens/guest/Registration";
import ResetPassword from "../screens/guest/ResetPassword";

const Stack = createStackNavigator();

const Guest = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerTitleAlign: "center" }} />
      <Stack.Screen name="Registration" component={Registration} options={{ title: "Create Account", headerTitleAlign: "center" }} />
      <Stack.Screen
        name="ForgottenPassword"
        component={ResetPassword}
        options={{ title: "Forgotten Password", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
};

export default Guest;
