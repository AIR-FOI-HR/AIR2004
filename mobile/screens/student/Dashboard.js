import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  Button,
  Text,
  Surface,
  Portal,
  Dialog,
  TextInput,
  FAB,
} from "react-native-paper";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showMessage } from "react-native-flash-message";

const moment = require("moment");

import CourseItem from "../student/components/CourseItem";
import AttendanceItem from "../student/components/AttendanceItem";

import api from "../../utils/api";
import { set } from "react-native-reanimated";

const Dashboard = ({ navigation }) => {
  const [coursePasscode, setCoursePasscode] = useState("");
  const [visible, toggleVisible] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [todayAttendanceData, setTodayAttendanceData] = useState([]);
  const [lastWeekAttendanceData, setLastWeekAttendanceData] = useState([]);

  const user = useSelector((state) => state.userState);

  useEffect(() => {
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
      .get("/attendance", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        setTodayAttendanceData(
          data.data.filter((item) => {
            moment().isSame(item.fullDate, "day") &&
              moment().isSame(item.fullDate, "month") &&
              moment()
                .isSame(item.fullDate, "year")
                .sort((a, b) =>
                  moment(a.fullDate).isBefore(b.fullDate)
                    ? -1
                    : moment(a.fullDate).isAfter(b.fullDate)
                    ? 1
                    : 0
                );
          })
        );

        setLastWeekAttendanceData(
          data.data.filter(
            (item) =>
              moment().subtract(7, "days").isBefore(item.fullDate) &&
              moment().isAfter(item.fullDate)
          )
        );
      })
      .catch((error) => console.log(error));
  }, []);

  const graphData = {
    labels: ["MON", "TUE", "WED", "THU", "FRI"],
    datasets: [
      {
        data: [
          lastWeekAttendanceData.filter((item) => item.day === "MONDAY").length,
          lastWeekAttendanceData.filter((item) => item.day === "TUESDAY")
            .length,
          lastWeekAttendanceData.filter((item) => item.day === "WEDNESDAY")
            .length,
          lastWeekAttendanceData.filter((item) => item.day === "THURSDAY")
            .length,
          lastWeekAttendanceData.filter((item) => item.day === "FRIDAY").length,
        ],
      },
    ],
  };

  const handleSubmitAddCourse = () => {
    const body = { passcode: coursePasscode };

    toggleVisible(false);

    api
      .post("/user/enroll", body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        console.log("ADDED COURSE", data.data.course);
        toggleVisible(false);
        setEnrolledCourses(enrolledCourses.concat(data.data.course));
        showMessage({
          message: "Thank you!",
          description: `You have been successfully added to course ${data.data.course.name}!`,
          type: "success",
          duration: 5000,
          icon: "success",
        });
      })
      .catch((error) => {
        if (error.response.data.message === "Course already enrolled.") {
          showMessage({
            message: "Warning",
            description: "Course with specified passcode is already enrolled.",
            type: "warning",
            duration: 5000,
            icon: "warning",
          });
        } else {
          showMessage({
            message: "Error occured!",
            description:
              "Please contact professor to add you manually or try again later!",
            type: "danger",
            duration: 5000,
            icon: "danger",
          });
        }
      });

    setCoursePasscode("");
  };

  return (
    <View>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Hi,{" "}
          <Text style={{ fontWeight: "bold" }}>
            {user.name} {user.surname}!
          </Text>
        </Text>

        <View style={{ marginTop: 25 }}>
          <Text style={styles.font}>Here's your summary for today:</Text>
          <Surface style={{ ...styles.graphContainer, marginTop: 20 }}>
            <Text
              style={
                (styles.font,
                {
                  marginLeft: 12,
                  marginTop: 12,
                  fontWeight: "bold",
                })
              }
            >
              Recent attendance
            </Text>

            <Text style={(styles.font, { marginLeft: 12, fontSize: 34 })}>
              {lastWeekAttendanceData.length}
            </Text>

            <Text style={(styles.font, { marginLeft: 12 })}>
              in the last week
            </Text>

            {lastWeekAttendanceData.length > 0 ? (
              <View
                style={{
                  marginTop: 10,
                  marginLeft: -10,
                  padding: 10,
                }}
              >
                {user.themePreference === "dark" ? (
                  <BarChart
                    data={graphData}
                    showBarTops={true}
                    showValuesOnTopOfBars={true}
                    withInnerLines={false}
                    segments={5}
                    withHorizontalLabels={false}
                    width={320}
                    height={220}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                    chartConfig={{
                      backgroundGradientFrom: "#272727",
                      backgroundGradientTo: "#272727",
                      data: graphData.datasets,
                      decimalPlaces: 2,
                      color: () => "#731ff0",
                      labelColor: () => "#6a6a6a",
                    }}
                  />
                ) : (
                  <BarChart
                    data={graphData}
                    showBarTops={true}
                    showValuesOnTopOfBars={true}
                    withInnerLines={false}
                    segments={5}
                    withHorizontalLabels={false}
                    width={320}
                    height={220}
                    withCustomBarColorFromData={true}
                    flatColor={true}
                    chartConfig={{
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      data: graphData.datasets,
                      decimalPlaces: 2,
                      color: () => "#731ff0",
                      labelColor: () => "#6a6a6a",
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={{ marginLeft: 20 }}>
                {user.themePreference === "dark" ? (
                  <MaterialCommunityIcons
                    color="white"
                    name="cloud-sync-outline"
                    size={26}
                  />
                ) : (
                  <MaterialCommunityIcons
                    color="black"
                    name="cloud-sync-outline"
                    size={26}
                  />
                )}
                <Text style={styles.font}>No data found!</Text>
              </View>
            )}
          </Surface>
        </View>

        <View style={{ marginTop: 15 }}>
          <Surface
            style={{ ...styles.graphContainer, height: 200 }}
            nestedScrollEnabled={true}
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
              Your attendance today
            </Text>

            {todayAttendanceData.length !== 0 ? (
              <FlatList
                nestedScrollEnabled={true}
                keyExtractor={(item) => item.id}
                data={mockData}
                renderItem={({ item }) => <AttendanceItem item={item} />}
              />
            ) : (
              <View style={{ marginLeft: 20 }}>
                {user.themePreference === "dark" ? (
                  <MaterialCommunityIcons
                    color="white"
                    name="cloud-sync-outline"
                    size={26}
                  />
                ) : (
                  <MaterialCommunityIcons
                    color="black"
                    name="cloud-sync-outline"
                    size={26}
                  />
                )}
                <Text style={styles.font}>No data found!</Text>
              </View>
            )}
          </Surface>
        </View>

        <View style={{ marginTop: 15 }}>
          <Surface
            style={{ ...styles.graphContainer, height: 200, marginBottom: 100 }}
            nestedScrollEnabled={true}
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
              Courses
            </Text>

            {enrolledCourses.length !== 0 ? (
              <FlatList
                nestedScrollEnabled={true}
                keyExtractor={(item) => item.id}
                data={enrolledCourses}
                extraData={enrolledCourses.length}
                renderItem={({ item }) => <CourseItem id={item.id} courseName={item.name} />}
              />
            ) : (
              <View style={{ marginLeft: 20 }}>
                {user.themePreference === "dark" ? (
                  <MaterialCommunityIcons
                    color="white"
                    name="cloud-sync-outline"
                    size={26}
                  />
                ) : (
                  <MaterialCommunityIcons
                    color="black"
                    name="cloud-sync-outline"
                    size={26}
                  />
                )}
                <Text style={styles.font}>No data found!</Text>
              </View>
            )}

            {user.themePreference === "dark" ? (
              <MaterialCommunityIcons
                style={styles.plusIcon}
                color="white"
                name="plus"
                size={35}
                onPress={() => toggleVisible(true)}
              />
            ) : (
              <MaterialCommunityIcons
                style={styles.plusIcon}
                color="black"
                name="plus"
                size={35}
                onPress={() => toggleVisible(true)}
              />
            )}
          </Surface>
        </View>

        <Portal>
          <Dialog
            visible={visible}
            onDismiss={() => {
              toggleVisible(false);
              setCoursePasscode("");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginRight: 20,
              }}
            >
              <Dialog.Title>Enter course join password:</Dialog.Title>
            </View>
            <Dialog.Content>
              <TextInput
                label="Enter course passcode"
                value={coursePasscode}
                mode="outlined"
                onChangeText={(coursePasscode) => setCoursePasscode(coursePasscode)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  toggleVisible(false);
                  setCoursePasscode("");
                }}
              >
                Cancel
              </Button>
              <Button onPress={() => handleSubmitAddCourse()}>Confirm</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>

      <FAB
        style={styles.fab}
        small
        label="SCAN"
        icon="qrcode"
        color="black"
        onPress={() => navigation.push("QRScan")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: "4%",
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 24,
    paddingTop: "2%",
  },

  graphContainer: {
    marginTop: 5,
    height: 350,
    elevation: 4,
  },

  attendanceContainer: {
    marginTop: 15,
    height: 150,
    elevation: 4,
  },

  font: {
    fontSize: 14,
  },

  plusIcon: {
    margin: 7,
    position: "absolute",
    right: 0,
    bottom: 0,
  },

  fab: {
    position: "absolute",
    margin: 17,
    right: 0,
    bottom: 0,
  },

  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 10,
  },
});

export default Dashboard;
