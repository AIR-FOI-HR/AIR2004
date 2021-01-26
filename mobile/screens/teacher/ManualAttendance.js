import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import SearchableDropdown from 'react-native-searchable-dropdown';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import api from "../../utils/api";

const ManualAttendance = () => {
  const user = useSelector((state) => state.teacherState);

  const enrolledStudentsIds = user.courseSelectedOnTablet.course.enrolledStudents;
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});

  useEffect(() => {
    api.get("/user/student").then((data) => {
      console.log("ENROLLED STUDENTS: ", data.data.data);
      const enrolledStudents = data.data.data.filter((student) => enrolledStudentsIds.includes(student.id));
      setEnrolledStudents(enrolledStudents);
    });
  }, []);

  const handleSaveAttendance = () => {
    const body = {
      lecture: user.courseSelectedOnTablet.lecture.id,
      user: selectedStudent.id,
    };

    api
      .post("/attendance/add", body)
      .then(({ data }) => {
        console.log("MANUAL ATTENDANCE ADDED");
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.radioButtonTitle}>Course name:</Text>

      <TextInput
        style={styles.textInput}
        value={user.courseSelectedOnTablet.course.name}
        mode="outlined"
        disabled="true"
      />


      <Text style={styles.studentTitle}>Lecture type:</Text>
      <Text style={styles.lectureType}>{user.courseSelectedOnTablet.lecture.type}</Text>

      <Text style={styles.studentTitle}>Student:</Text>
      <SearchableDropdown
          onItemSelect={(student) => setSelectedStudent(student)}
          containerStyle={{ padding: 5 }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#ddd',
            borderColor: '#bbb',
            borderWidth: 1,
            borderRadius: 5,
          }}
          itemTextStyle={{ color: '#222' }}
          itemsContainerStyle={{ maxHeight: 140 }}
          items={enrolledStudents}
          textInputProps={
            {
              placeholder: `${Object.keys(selectedStudent).length === 0 ? `Ime Prezime (JMBAG)` : `${selectedStudent.name} ${selectedStudent.surname} (${selectedStudent.jmbag})`}`,
              underlineColorAndroid: "transparent",
              style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
              },
            }
          }
          listProps={
            {
              nestedScrollEnabled: true,
            }
          }
        />
      <Button
        style={{ marginTop: 50 }}
        mode="contained"
        icon={() => <MaterialCommunityIcons name="plus" size={35} color="#fff" />}
        onPress={handleSaveAttendance}
      >
        Save attendance
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  radioButtonTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  radioButtonGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    width: "100%",
    padding: 25,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  studentTitle: {
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  lectureType: {
    paddingTop:10,
    fontSize: 18,
  },
  textInput: {
    width: 330,
    height: 50,
    marginTop: 5,
    paddingLeft: 5,
  },
});
export default ManualAttendance;