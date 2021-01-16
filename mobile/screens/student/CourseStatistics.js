import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Surface, DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { useSelector } from "react-redux";
import { LineChart } from "react-native-chart-kit";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AnimatedLoader from "react-native-animated-loader";

import AttendanceItem from "../student/components/AttendanceItem";

import api from "../../utils/api";

const moment = require("moment");

const CourseStatistics = ({ route }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [missedAttendanceData, setMissedAttendanceData] = useState([]);
  const [lectureData, setLectureData] = useState([]);
  const [animationVisible, setAnimationVisible] = useState(true);
  const { courseId } = route.params;
  const { selectedCourse } = route.params;

  const user = useSelector((state) => state.userState);

  useEffect(() => {
    const getAllSubmitedAttendances = async () => {
      await api
        .get("/attendance", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        })
        .then(({ data }) => {
          setAttendanceData(
            data.data
              .filter((item) => item.courseName === selectedCourse)
              .sort((a, b) =>
                moment(a.fullDate).isBefore(b.fullDate)
                  ? -1
                  : moment(a.fullDate).isAfter(b.fullDate)
                  ? 1
                  : 0
              )
          );
        })
        .catch((error) => console.log(error));
    };

    const getAllMissedAttendances = async () => {
      await api
        .get("attendance/missed", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        })
        .then(({ data }) => {
          setMissedAttendanceData(
            data.data
              .sort((a, b) =>
                moment(a.fullDate).isBefore(b.fullDate)
                  ? -1
                  : moment(a.fullDate).isAfter(b.fullDate)
                  ? 1
                  : 0
              )
              .filter((item) => item.courseName === selectedCourse)
          );
        })
        .catch((error) => console.log(error));
    };

    api
      .get("/user/details", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        setEnrolledCourses(data.data.enrolledCourses);
      })
      .catch((error) => console.log(error));

    api
      .get("/lecture")
      .then(({ data }) =>
        setLectureData(
          data.data.filter((item) => item.course.name === selectedCourse)
        )
      )
      .catch((error) => console.log(error));

    getAllSubmitedAttendances();
    getAllMissedAttendances();

    setTimeout(() => {
      setAnimationVisible(false);
    }, 2700);
  }, []);

  return (
    <View style={styles.container}>
      {animationVisible === true ? (
        <AnimatedLoader
          visible={animationVisible}
          overlayColor="rgba(255,255,255,0)"
          source={require("../../assets/animations/935-loading.json")}
          animationStyle={styles.lottie}
          speed={1}
          loop={false}
        />
      ) : (
        <View>
          <View>
            <Surface
              style={{
                ...styles.attendanceContainer,
                marginTop: 5,
                width: "100%",
                height: 100,
              }}
            >
              <Text
                style={
                  (styles.font,
                  {
                    margin: 12,
                    marginBottom: 5,
                    fontWeight: "bold",
                  })
                }
              >
                Total attended
              </Text>

              <Text style={(styles.font, { marginLeft: 12, fontSize: 34 })}>
                {attendanceData.length}/{lectureData.length}
              </Text>
            </Surface>
          </View>

          <View style={{ marginTop: 10 }}>
            <Surface
              style={{
                ...styles.attendanceContainer,
                marginTop: 5,
              }}
            >
              <Text
                style={
                  (styles.font,
                  {
                    margin: 12,
                    marginBottom: 5,
                    fontWeight: "bold",
                  })
                }
              >
                Your attendance on {selectedCourse}
              </Text>

              {attendanceData.concat(missedAttendanceData).length !== 0 ? (
                <FlatList
                  keyExtractor={(item) => item.id}
                  data={attendanceData.concat(missedAttendanceData)}
                  renderItem={({ item }) => <AttendanceItem item={item} />}
                />
              ) : (
                <View style={{ marginLeft: 20 }}>
                  <MaterialCommunityIcons name="cloud-sync-outline" size={26} />
                  <Text style={styles.font}>No data found!</Text>
                </View>
              )}
            </Surface>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "4%",
    width: "100%",
    height: "100%",
  },

  attendanceContainer: {
    height: "auto",
    elevation: 4,
  },

  font: {
    fontSize: 14,
  },

  lottie: {
    width: 200,
    height: 200,
  },
});

export default CourseStatistics;
