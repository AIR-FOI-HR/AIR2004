import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BlankSpacer from "react-native-blank-spacer";

import Dashboard from "../screens/teacher/Dashboard";
import Attendance from "../screens/teacher/Attendance";
import Courses from "../screens/teacher/Courses";
import Settings from "../screens/common/Settings";

import NewCourse from "../screens/teacher/NewCourse";
import EditCourse from "../screens/teacher/EditCourse";
import QR from "../screens/teacher/QR";
import * as Biometrics from "../utils/biometrics";
import BiometricAuthenticationDialog from "../screens/common/components/BiometricAuthenticationDialog";

import { signOut } from "../store/actions/user";

const Stack = createStackNavigator();
const Tabs = createMaterialBottomTabNavigator();
const CoursesStack = createStackNavigator();

const CoursesStackNavigation = () => {
  return (
    <CoursesStack.Navigator headerMode="none">
      <CoursesStack.Screen name="Courses" component={Courses} />
      <CoursesStack.Screen name="NewCourse" component={NewCourse} />
      <CoursesStack.Screen name="EditCourse" component={EditCourse} />
    </CoursesStack.Navigator>
  );
};

const TeacherTabNavigation = () => {
  return (
    <Tabs.Navigator barStyle={{ backgroundColor: "#6202EE" }}>
      <Tabs.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => <FontAwesomeIcons name="home" color={color} size={22} />,
        }}
      />

      <Tabs.Screen
        name="Attendance"
        component={Attendance}
        options={{
          tabBarLabel: "Attendance",
          tabBarIcon: ({ color }) => <FontAwesomeIcons name="list" color={color} size={22} />,
        }}
      />

      <Tabs.Screen
        name="Courses"
        component={CoursesStackNavigation}
        options={{
          tabBarLabel: "Courses",
          tabBarIcon: ({ color }) => <FontAwesomeIcons name="book" color={color} size={22} />,
        }}
      />
    </Tabs.Navigator>
  );
};

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Dashboard";
  if (route.name == "Settings") return "Settings"; // temporary workaround for settings
  switch (routeName) {
    case "Dashboard":
      return "Dashboard";
    case "Attendance":
      return "Attendance";
    case "Courses":
      return "Courses";
  }
}

const Teacher = ({ navigation }) => {
  const dispatch = useDispatch();

  const [biometricsDialogVisible, setBiometricsDialogVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsAuthentication, setNeedsAuthentication] = useState(false);

  useEffect(() => {
    // on first load of Dashboard, check for biometric authentication
    const biometrics = async () => {
      const biometricAuthenticationPreference = await Biometrics.checkBiometricAuthenticationPreference();
      const isEligibleForBiometricAuthentication = await Biometrics.isEligibleForBiometricAuthentication();
      console.log("PREFERENCE", biometricAuthenticationPreference);
      switch (biometricAuthenticationPreference) {
        case null:
          // we need to offer option to use biometric authentication
          if (isEligibleForBiometricAuthentication) {
            setBiometricsDialogVisible(true);
          }
          break;
        case true:
          // check in case user deleted their biometric records
          if (isEligibleForBiometricAuthentication) {
            setNeedsAuthentication(true);
            const auth = await Biometrics.handleAuthentication();
            setIsAuthenticated(auth);
          }
          break;
        case false:
          break;
        default:
          break;
      }
    };

    biometrics();
  }, []);

  if (biometricsDialogVisible) {
    return (
      <BiometricAuthenticationDialog
        biometricsDialogVisible={biometricsDialogVisible}
        setBiometricsDialogVisible={setBiometricsDialogVisible}
      />
    );
  }
  if (needsAuthentication == true && isAuthenticated == false) {
    return null;
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Dashboard"
          component={TeacherTabNavigation}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: "white",
            headerStyle: { backgroundColor: "#6202EE" },
            headerRight: () => (
              <View style={{ marginRight: 12, display: "flex", flexDirection: "row" }}>
                <MaterialIcons
                  name="settings"
                  size={26}
                  color={"white"}
                  onPress={() => {
                    navigation.push("Settings");
                  }}
                />
                <BlankSpacer width={20} />
                <MaterialIcons name="logout" size={26} color={"white"} onPress={() => dispatch(signOut())} />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerTintColor: "white",
            headerStyle: { backgroundColor: "#6202EE" },
          })}
        />
        <Stack.Screen
          name="QRScan"
          component={QR}
          options={{
            headerTitle: "QR Scan",
            headerTintColor: "white",
            headerStyle: { backgroundColor: "#6202EE" },
          }}
        />
      </Stack.Navigator>
    );
  }
};

export default Teacher;
