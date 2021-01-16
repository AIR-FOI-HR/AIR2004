import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet } from "react-native";
import { Text, FAB } from "react-native-paper";
import { io } from "socket.io-client";

import { setCourseSelectedOnTablet, signOutTablet, startTracking } from "../../store/actions/teacher";
import DashboardAfterCourseSelection from "./components/DashboardAfterCourseSelection";
import DashboardAfterTabletLogin from "./components/DashboardAfterTabletLogin";
import DashboardBeforeTabletLogin from "./components/DashboardAfterLogin";
import { WSS_URL } from "../../constants";

const Dashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userState);
  const socket = useRef();

  useEffect(() => {
    socket.current = io(WSS_URL + "/teacher", {
      query: {
        attendanceToken: user.attendanceToken,
      },
    });
    socket.current.on("lecture selected", (data) => {
      dispatch(setCourseSelectedOnTablet(data));
    });

    return () => socket.current.disconnect();
  }, [user.attendanceToken]);

  const handleSignOut = () => {
    socket.current.emit("sign out tablet", { attendanceToken: user.attendanceToken, lecture: user.courseSelectedOnTablet.lecture.id });
    dispatch(signOutTablet());
  };

  const handleStartTracking = () => {
    dispatch(startTracking());
    socket.current.emit("start tracking", { lecture: user.courseSelectedOnTablet.lecture.id });
    navigation.navigate("Attendance");
  };

  const DashBoardContainer = () => {
    // Dashboard before teacher signs in on the tablet
    if (!user.attendanceToken) return <DashboardBeforeTabletLogin />;

    // Dashboard after teacher has signed in on the tablet
    if (!user.courseSelectedOnTablet) return <DashboardAfterTabletLogin handleSignOut={handleSignOut} />;

    // Dashboard after course is selected on the tablet
    return <DashboardAfterCourseSelection handleSignOut={handleSignOut} handleStartTracking={handleStartTracking} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hi,{" "}
        <Text style={styles.textBold}>
          {user.name} {user.surname}!
        </Text>
      </Text>
      <View style={styles.dashboardContainer}>
        <DashBoardContainer />
        {user.attendanceToken == null && (
          <FAB style={styles.fab} small label="SIGN IN ON TABLET" icon="qrcode" color="black" onPress={() => navigation.push("QRScan")} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  dashboardContainer: {
    padding: "4%",
    width: "100%",
    height: "100%",
  },
  font: {
    fontSize: 15,
  },
  title: {
    fontSize: 24,
    paddingTop: "3.75%",
    paddingLeft: "4%",
    paddingRight: "4%",
  },
  textBold: {
    fontWeight: "bold",
  },
  stepContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#bbbfc4",
  },
  fab: {
    position: "absolute",
    marginBottom: 105,
    marginRight: 12,
    right: 0,
    bottom: 0,
  },
});

export default Dashboard;
