import React from "react";
import { View, StyleSheet } from "react-native";
import BlankSpacer from "react-native-blank-spacer";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, IconButton, Title, Text } from "react-native-paper";

const CourseItem = ({ course }) => {
  console.log("COURSE", course);
  return (
    <>
      <Card>
        <Card.Content>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
            <Title style={styles.cardTitle}>{course.name}</Title>
            <IconButton
              icon={() => <MaterialCommunityIcon name="pencil-outline" size={20} />}
              onPress={() => navigation.push("EditCourse")}
            />
          </View>

          <View style={styles.cardContentWrapper}>
            <Text>Allowed absences: {course.allowedAbsences}</Text>
            <Text>Course passcode: {course.passcode}</Text>
            <View style={styles.cardActions}></View>
          </View>
        </Card.Content>
      </Card>
      <BlankSpacer height={15} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
  },

  pageTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },

  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "normal",
  },
  cardContentWrapper: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  cardLectureTypes: {
    flexDirection: "row",
  },
  cardActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default CourseItem;
