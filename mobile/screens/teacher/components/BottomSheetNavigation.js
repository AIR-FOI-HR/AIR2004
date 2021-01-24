import React, { useCallback, useMemo, useRef } from "react";

import { createStackNavigator, HeaderBackButton, TransitionPresets } from "@react-navigation/stack";
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet";
import LectureAttendedStudents from "./LectureAttendedStudents";

import BottomSheetBackground from "./BottomSheetBackground";

import LecturesList from "./LecturesList";
import { useTheme } from "react-native-paper";

const Stack = createStackNavigator();
const Navigator = () => {
  const isDarkTheme = useTheme().dark;
  const screenOptions = useMemo(
    () => ({
      ...TransitionPresets.FadeFromBottomAndroid,
      headerShown: true,
      safeAreaInserts: { top: 0 },
      headerLeft: ({ onPress, ...props }) => (
        <TouchableOpacity onPress={onPress}>
          <HeaderBackButton {...props} />
        </TouchableOpacity>
      ),
      cardStyle: {
        backgroundColor: isDarkTheme == true ? "black" : "white",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: `${isDarkTheme == true ? "#FFF" : "#000"}`,
        borderRadius: 1,
        overflow: "visible",
      },
    }),
    [isDarkTheme]
  );

  const LecturesScreenOptions = useMemo(() => ({ headerLeft: () => null }), []);

  return (
    <Stack.Navigator screenOptions={screenOptions} headerMode="screen">
      <Stack.Screen name="Recent Lectures" options={LecturesScreenOptions} component={LecturesList} />
      <Stack.Screen name="Students" component={LectureAttendedStudents} />
    </Stack.Navigator>
  );
};

const BottomSheetNavigation = () => {
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["3%", "50%", "80%"], []);

  // callbacks

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChange={handleSheetChange} backgroundComponent={BottomSheetBackground}>
      <Navigator />
    </BottomSheet>
  );
};

export default BottomSheetNavigation;
