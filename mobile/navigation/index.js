import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";

import { signIn } from "../store/actions/user";
import Student from "./Student";
import Teacher from "./Teacher";
import Guest from "./Guest";

const Stack = createStackNavigator();

const Navigation = () => {
  const user = useSelector((state) => state.userState);
  const dispatch = useDispatch();

  useEffect(() => {
    checkIfSignedIn();
  }, []);

  // Checks whether user is already logged in (his data is stored in AsyncStorage)
  const checkIfSignedIn = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) dispatch(signIn(JSON.parse(userData)));
  };

  return (
    <Stack.Navigator headerMode="none">
      {user.token === null ? (
        <Stack.Screen name="Login" component={Guest} />
      ) : user.userType === "student" ? (
        <Stack.Screen name="Dashboard" component={Student} />
      ) : (
        <Stack.Screen name="Dashboard" component={Teacher} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
