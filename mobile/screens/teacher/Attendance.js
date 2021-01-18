import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, FAB, Portal, Dialog, Paragraph, Button } from "react-native-paper";
import StudentAttendanceCard from "./components/StudentAttendanceCard";
import { ScrollView } from "react-native-gesture-handler";
import { io } from "socket.io-client";
import { WSS_URL } from "../../constants";

const Attendance = ({ navigation }) => {
  const dispatch = useDispatch();
  const teacher = useSelector((state) => state.teacherState);
  const [attendances, setAttendances] = useState([]);
  const [shown, setShown] = useState(false);

  const [fabOpen, setFabOpen] = useState(false);
  const socket = useRef();

  useEffect(() => {
    if (!teacher.courseSelectedOnTablet) return;

    socket.current = io(WSS_URL + "/teacher", {
      query: {
        attendanceToken: teacher.attendanceToken,
        fetchLectureAttendance: teacher.courseSelectedOnTablet.lecture.id,
      },
    });
    socket.current.on("lecture selected", (data) => {
      dispatch(setCourseSelectedOnTablet(data));
    });

    socket.current.on("all attendances", (data) => {
      setAttendances(data);
    });

    socket.current.on("new attendance", (data) => {
      setAttendances((old) => [data, ...old]);
    });

    return () => socket.current.disconnect();
  }, []);

  if (!teacher.courseSelectedOnTablet)
    return (
      <View style={styles.container}>
        <View>
          <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500", marginBottom: 20 }}>Attendance marking is not started!</Text>
          <Text style={{ textAlign: "center" }}>
            Please go to the dashboard and click "Sign in on tablet" button to sign in on a tablet in a lecture room.
          </Text>
        </View>
      </View>
    );

  return (
    <View>
      <View style={{ width: "100%", height: "100%" }}>
        <FAB.Group
          open={fabOpen}
          style={styles.fab}
          small
          icon="plus"
          actions={[
            {
              icon: "account-plus",
              label: "Manual entry",
              style: { backgroundColor: "#62D7C5" },
              onPress: () => navigation.push("ManualAttendance"),
            },
            {
              icon: "check-all",
              label: "Finish tracking",
              style: { backgroundColor: "#62D7C5" },
              onPress: () => setShown(true),
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
        />
        <View style={{ margin: 10 }}>
          <Text style={styles.title}>Now tracking:</Text>
          <Text style={styles.courseName}>Software Analysis</Text>
          <ActivityIndicator animating={true} size={40} style={{ paddingVertical: 10 }} />
        </View>
        <ScrollView>
          {!attendances.length && <Text style={{ textAlign: "center" }}>There are no marked attendances yet!</Text>}
          {attendances.map((attendance) => (
            <StudentAttendanceCard key={attendance.id} data={attendance} />
          ))}
        </ScrollView>
      </View>
      <Portal>
        <Dialog visible={shown} onDismiss={() => setShown(false)}>
          <Dialog.Title>Finish Tracking</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to finish tracking attendance for this lecture?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShown(false)}>Cancel</Button>
            <Button onPress={() => setShown(false)}>Finish</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 35,
  },
  title: {
    fontSize: 20,
  },
  courseName: {
    fontSize: 30,
    marginVertical: 7,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    margin: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});

export default Attendance;
