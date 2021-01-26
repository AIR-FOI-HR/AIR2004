import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { IconButton, Text } from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";

import api from "../../utils/api";
import Loading from "../common/components/Loading";
import { setCourses, setLectures } from "../../store/actions/teacher";

import CourseItem from "./components/CourseItem";

import BottomSheetNavigation from "./components/BottomSheetNavigation";

const Courses = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState);
  const courses = useSelector((state) => state.teacherState.courses);
  const lectures = useSelector((state) => state.teacherState.lectures);

  useEffect(() => {
    api
      .get("/user/details")
      .then(({ data }) => dispatch(setCourses(data.data.assignedCourses)))
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.pageTitle}>Your courses</Text>
        <IconButton
          icon="plus"
          size={30}
          onPress={() => navigation.push("NewCourse")}
        />
      </View>
      {courses == null ? (
        <Loading />
      ) : (
        <FlatList
          data={courses}
          renderItem={({ item }) => (
            <CourseItem course={item} navigation={navigation} />
          )}
          keyExtractor={(course) => course.id}
        />
      )}
      <BottomSheetNavigation />
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
