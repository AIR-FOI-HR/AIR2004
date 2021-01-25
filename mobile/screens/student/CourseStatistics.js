import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Surface } from "react-native-paper";
import { useSelector } from "react-redux";

import AttendanceItem from "../student/components/AttendanceItem";
import Loading from "../common/components/Loading";

import api from "../../utils/api";

const moment = require("moment");

const CourseStatistics = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [missedAttendanceData, setMissedAttendanceData] = useState([]);
  const [lectureData, setLectureData] = useState([]);
  const { courseId } = route.params;
  const { selectedCourse } = route.params;

  const user = useSelector((state) => state.userState);

  useEffect(() => {
    const getAllSubmitedAttendances = async () => {
      setLoading(true);
      await api
        .get("/attendance")
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
        .catch((error) => console.log(error))
        .finally(() => {
          setLoading(false);
        });
    };

    const getAllMissedAttendances = async () => {
      setLoading(true);
      await api
        .get("attendance/missed")
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
        .catch((error) => console.log(error))
        .finally(() => {
          setLoading(false);
        });
    };

    api
      .get("/user/details")
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
  }, []);

  return (
    <View style={styles.container}>
      {!loading ? (
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
                <View style={{ margin: 20 }}>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 15,
                        fontWeight: "500",
                        marginBottom: 20,
                        marginTop: 20,
                      }}
                    >
                      You don't have any attendance record on {selectedCourse}{" "}
                      yet!
                    </Text>
                    <Text style={{ textAlign: "center" }}>
                      Attendances will be displayed after your first attendance.
                    </Text>
                  </View>
                </View>
              )}
            </Surface>
          </View>
        </View>
      ) : (
        <View>
          <Loading />
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
    height: "90%",
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
