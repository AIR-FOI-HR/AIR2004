import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { FAB, Provider as PaperProvider } from "react-native-paper";
import { addCourse } from "../../store/actions/teacher";

import api from "../../utils/api";

const Courses = () => {
  const teacherId = useSelector((state) => state.userState.userId);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [allowedAbsences, setAllowedAbsences] = useState(0);

  console.log("TEACHER", teacherId);

  const handleAddCourse = () => {
    api.post("/course/add", { name, passcode, allowedAbsences, teacherId }).then((data) => {
      dispatch(addCourse(data.data.data));
    });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>
          <Text style={styles.firstWord}>Add</Text> a new course
        </Text>
        <Text style={styles.title}>Course name:</Text>
        <TextInput style={styles.textInput} label="Course name" value={name} onChangeText={(name) => setName(name)} />

        <Text style={styles.title}>Course join passcode:</Text>
        <TextInput style={styles.textInput} label="Join passcode" value={passcode} onChangeText={(passcode) => setPasscode(passcode)} />

        <Text style={styles.title}>Number of allowed absences:</Text>
        <TextInput
          style={styles.textInput}
          label="Allowed absences"
          value={allowedAbsences}
          onChangeText={(allowedAbsences) => setAllowedAbsences(allowedAbsences)}
        />
      </View>
      <FAB style={styles.fab} small label="add" icon="plus" color="black" onPress={handleAddCourse} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    margin: 25,
  },
  courseIcon: {
    backgroundColor: "white",
    width: 35,
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  fab: {
    position: "absolute",
    marginBottom: 25,
    marginRight: 20,
    right: 0,
    bottom: 0,
  },
  courseCard: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "normal",
  },
  cardContentWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cardLectureTypes: {
    flexDirection: "row",
  },
  cardActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  firstWord: {
    fontWeight: "bold",
  },
  lectureTypeBadge: {
    borderWidth: 1.5,
    marginRight: 5,
    borderColor: "#9b5cf4",
    backgroundColor: "#f2eafe",
  },
});

export default Courses;
