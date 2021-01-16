import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";

const CourseItem = ({ id, courseName }) => {
  return (
    <View style={styles.conatiner}>
      <Chip
        style={styles.chip}
        key={id}
        textStyle={{ color: "#731ff0" }}
        mode="outlined"
        icon={() => <FontAwesomeIcons name="graduation-cap" size={16} />}
        onPress={() => console.log("Pressed")}
      >
        {courseName}
      </Chip>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  chip: {
    backgroundColor: "#dcc7fc",
    borderWidth: 1,
    borderColor: "#731ff0",
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5,
  },
});

export default CourseItem;
