import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { IconButton, Text, Title, Card } from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import api from "../../utils/api";
import Loading from "../common/components/Loading";
import { setCourses, setLectures } from "../../store/actions/teacher";
import LectureItem from "./components/LectureItem";
import CourseItem from "./components/CourseItem";

const Courses = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState);
  const courses = useSelector((state) => state.teacherState.courses);
  const lectures = useSelector((state) => state.teacherState.lectures);

  console.log("COURSES", courses);
  useEffect(() => {
    api
      .get("/user/details", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => dispatch(setCourses(data.data.assignedCourses)))
      .catch((error) => console.log(error));
    api
      .get("/lecture/lecturesForTeacher", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => dispatch(setLectures(data.data)))
      .catch((error) => console.log(error));
  }, []);

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["1%", "50%", "80%"], []);

  // callbacks

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.pageTitle}>Your courses</Text>
        <IconButton icon="plus" size={30} onPress={() => navigation.push("NewCourse")} />
      </View>
      {courses == null ? (
        <Loading />
      ) : (
        <FlatList data={courses} renderItem={({ item }) => <CourseItem course={item} />} keyExtractor={(course) => course.id} />
      )}

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChange={handleSheetChange}>
        <Text style={{ fontWeight: "bold", fontSize: 19, paddingLeft: 15 }}>Recent lectures</Text>
        <BottomSheetFlatList
          keyExtractor={(lecture) => lecture.id}
          data={lectures}
          renderItem={({ item }) => <LectureItem lecture={item} />}
        />
      </BottomSheet>
    </View>
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
});

export default Courses;
