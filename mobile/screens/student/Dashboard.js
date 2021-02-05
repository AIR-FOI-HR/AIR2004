import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Button, Text, Surface, Portal, Dialog, TextInput, FAB, useTheme } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const moment = require("moment");

import CourseItem from "../student/components/CourseItem";
import AttendanceItem from "../student/components/AttendanceItem";
import Loading from "../common/components/Loading";

import api from "../../utils/api";

const Dashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [qrCodeString, setQrCodeString] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [coursePasscode, setCoursePasscode] = useState("");
  const [visible, toggleVisible] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [todayAttendanceData, setTodayAttendanceData] = useState([]);
  const [lastWeekAttendanceData, setLastWeekAttendanceData] = useState([]);

  const isFocused = useIsFocused();
  const isDarkTheme = useTheme().dark;

  const user = useSelector((state) => state.userState);

  useEffect(() => {
    setLoading(true);

    api.get("/user/details").then((data) => {
      setEnrolledCourses(data.data.data.enrolledCourses);

      api
        .get("/attendance/by-student")
        .then((data) => {
          setTodayAttendanceData(data.data.data.filter((item) => moment().isSame(item.fullDate, "date")));
          setLastWeekAttendanceData(
            data.data.data.filter((item) => moment().subtract(7, "days").isBefore(item.fullDate) && moment().isAfter(item.fullDate))
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [isFocused]);

  const graphData = {
    labels: ["MON", "TUE", "WED", "THU", "FRI"],
    datasets: [
      {
        data: [
          lastWeekAttendanceData.filter((item) => item.day === "MONDAY").length,
          lastWeekAttendanceData.filter((item) => item.day === "TUESDAY").length,
          lastWeekAttendanceData.filter((item) => item.day === "WEDNESDAY").length,
          lastWeekAttendanceData.filter((item) => item.day === "THURSDAY").length,
          lastWeekAttendanceData.filter((item) => item.day === "FRIDAY").length,
        ],
      },
    ],
  };

  const handleSubmitAddCourse = () => {
    const body = { passcode: coursePasscode };

    toggleVisible(false);

    api
      .post("/user/enroll", body)
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
            description: "Please contact professor to add you manually or try again later!",
            type: "danger",
            duration: 5000,
            icon: "danger",
          });
        }
      });

    setCoursePasscode("");
  };

  const handleManualSubmit = () => {
    api
      .post("/attendance/mark", { code: qrCodeString, user: user.userId })
      .then((data) => {
        setShowModal(false);
        setQrCodeString("");
        showMessage({
          message: "Thank you!",
          description: "Your attendance has been saved!",
          type: "success",
          duration: 5000,
          icon: "success",
        });
      })
      .catch((error) => {
        console.log("ERRORRRR", error.response.error);
        showMessage({
          message: "Error occured!",
          description:
            "You either scanned an invalid QR code or you have already marked your attendance to this lecture. If you think this is an error, please ask the teacher for assistance.",
          type: "danger",
          duration: 7000,
          icon: "danger",
        });
      });
  };

  return (
    <View>
      {!loading ? (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>
            Hi,{" "}
            <Text style={{ fontWeight: "bold" }}>
              {user.name} {user.surname}!
            </Text>
          </Text>
          <View style={{ marginTop: 25 }}>
            <Text style={styles.font}>Here's your summary:</Text>
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

              <Text style={(styles.font, { marginLeft: 12, fontSize: 34 })}>{lastWeekAttendanceData.length}</Text>

              <Text style={(styles.font, { marginLeft: 12 })}>in the last week</Text>

              {lastWeekAttendanceData.length > 0 ? (
                <View
                  style={{
                    marginTop: 10,
                    marginLeft: -10,
                    padding: 10,
                  }}
                >
                  {isDarkTheme ? (
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
                <View style={{ margin: 20 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "500",
                      marginBottom: 20,
                      marginTop: 20,
                    }}
                  >
                    You don't have any attendance in the last week!
                  </Text>
                </View>
              )}
            </Surface>
          </View>

          <View style={{ marginTop: 15 }}>
            <Surface style={{ ...styles.graphContainer, height: 200 }} nestedScrollEnabled={true}>
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
                  data={todayAttendanceData}
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
                      You don't have any attendance record today!
                    </Text>
                    <Text style={{ textAlign: "center" }}>Attendances will be displayed after your QR code scanning today.</Text>
                  </View>
                </View>
              )}
            </Surface>
          </View>

          <View style={{ marginTop: 15 }}>
            <Surface
              style={{
                ...styles.graphContainer,
                height: 200,
                marginBottom: 100,
              }}
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
                      You don't have any course enrolled yet!
                    </Text>
                    <Text style={{ textAlign: "center" }}>Courses will be displayed after your first enroll on course.</Text>
                  </View>
                </View>
              )}

              {isDarkTheme ? (
                <MaterialCommunityIcons style={styles.plusIcon} color="white" name="plus" size={35} onPress={() => toggleVisible(true)} />
              ) : (
                <MaterialCommunityIcons style={styles.plusIcon} color="black" name="plus" size={35} onPress={() => toggleVisible(true)} />
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

          <Portal>
            <Dialog
              visible={showModal}
              onDismiss={() => {
                setShowModal(false);
                setQrCodeString("");
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginRight: 20,
                }}
              >
                <Dialog.Title>Enter QR code string:</Dialog.Title>
              </View>
              <Dialog.Content>
                <TextInput
                  label="Enter QR code string"
                  value={qrCodeString}
                  mode="outlined"
                  onChangeText={(qrCodeString) => setQrCodeString(qrCodeString)}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    setShowModal(false);
                    setQrCodeString("");
                  }}
                >
                  Cancel
                </Button>
                <Button onPress={() => handleManualSubmit()}>Confirm</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ScrollView>
      ) : (
        <View>
          <Loading />
        </View>
      )}
      {!loading && (
        <FAB.Group
          open={fabOpen}
          style={styles.fab}
          small
          icon="plus"
          actions={[
            {
              icon: "qrcode",
              label: "Scan QR code",
              style: { backgroundColor: "#62D7C5" },
              onPress: () => navigation.push("QRScan"),
            },
            {
              icon: "card-text-outline",
              label: "Enter QR code string",
              style: { backgroundColor: "#62D7C5" },
              onPress: () => setShowModal(true),
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
        />
      )}
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
    margin: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 10,
  },
});

export default Dashboard;
