import React, { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { withTheme } from "react-native-paper";

import Animated, { interpolateColors } from "react-native-reanimated";

const BottomSheetBackground = ({ animatedIndex, style }) => {
  const isDarkTheme = useTheme().dark;
  // animated variables
  const animatedBackground = useMemo(
    () =>
      interpolateColors(animatedIndex, {
        inputRange: [0, 1],
        outputColorRange: [`${isDarkTheme == true ? "#000" : "#FFF"}`, `${isDarkTheme == true ? "#000" : "#FFF"}`],
      }),
    [isDarkTheme]
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: animatedBackground,
        borderWidth: 1,
        borderColor: `${isDarkTheme == true ? "#FFF" : "#000"}`,
        borderRadius: 9,
      },
    ],
    [style, animatedBackground]
  );

  return <Animated.View style={containerStyle} />;
};

export default withTheme(BottomSheetBackground);
