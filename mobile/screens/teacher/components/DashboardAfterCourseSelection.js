import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, FAB, Chip } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DashboardAfterCourseSelection = ({ handleSignOut, handleStartTracking }) => {
  const user = useSelector((state) => state.userState);

  return (
    <>
      <View style={{ marginTop: 25 }}>
        <Text style={styles.font}>You are signed in a lecture room for course</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: 10 }}>
        <Chip
          style={styles.chip}
          textStyle={{ color: "#731ff0" }}
          mode="outlined"
          icon={() => <FontAwesomeIcons name="graduation-cap" size={16} />}
        >
          {user.courseSelectedOnTablet.course.name} | {user.courseSelectedOnTablet.lecture.type}
        </Chip>
      </View>

      {!user.trackingStarted && (
        <View style={{ ...styles.stepContainer, marginTop: 25 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Start tracking attendance</Text>
          <Text style={{ ...styles.font, marginTop: 10, marginBottom: 10, lineHeight: 20 }}>
            If the lecture is finished, click this button to start tracking yout student's attendance. QR codes will start to generate on
            the tablet.
          </Text>
          <Button
            style={{ marginTop: 20, marginBottom: 27 }}
            mode="contained"
            icon={() => <MaterialCommunityIcons name="plus" size={35} color="#fff" />}
            onPress={handleStartTracking}
          >
            START TRACKING ATTENDANCE
          </Button>
        </View>
      )}

      {user.trackingStarted && (
        <View style={{ ...styles.stepContainer, marginTop: 25 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>Stop tracking attendance</Text>
          <Text style={{ ...styles.font, marginTop: 10, marginBottom: 10, lineHeight: 20 }}>
            If all students have marked their attendance, click the button below.
          </Text>
          <Button
            style={{ marginTop: 20, marginBottom: 27 }}
            mode="contained"
            icon={() => <MaterialCommunityIcons name="plus" size={35} color="#fff" />}
            onPress={handleSignOut}
          >
            STOP TRACKING ATTENDANCE
          </Button>
        </View>
      )}

      <View style={{ ...styles.stepContainer, marginTop: 25 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Sign out</Text>
        <Text style={{ ...styles.font, marginTop: 10, marginBottom: 10, lineHeight: 20 }}>
          To sign out of the tablet and let other teacher sign in, click this button.
        </Text>
        <Button
          style={{ marginTop: 20, marginBottom: 27 }}
          mode="contained"
          icon={() => <MaterialCommunityIcons name="plus" size={35} color="#fff" />}
          onPress={handleSignOut}
        >
          SIGN OUT
        </Button>
      </View>
    </>
  );
};

export default DashboardAfterCourseSelection;

const styles = StyleSheet.create({
  container: {
    margin: 25,
  },

  font: {
    fontSize: 15,
  },

  title: {
    fontSize: 24,
  },

  stepContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#bbbfc4",
  },

  fab: {
    position: "absolute",
    marginBottom: 40,
    marginRight: 20,
    right: 0,
    bottom: 0,
  },

  chip: {
    backgroundColor: "#dcc7fc",
    borderWidth: 1,
    borderColor: "#731ff0",
    marginTop: 10,
  },
});
