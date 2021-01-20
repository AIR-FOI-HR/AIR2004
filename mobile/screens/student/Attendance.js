import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import AttendanceItem from "../student/components/AttendanceItem";
import Loading from "../common/components/Loading";

import api from "../../utils/api";

const moment = require("moment");

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Courses");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const isFocused = useIsFocused();

  const user = useSelector((state) => state.userState);

  useEffect(() => {
    setLoading(true);
    api
      .get("/attendance", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        setAttendanceData(data.data);
        setFilteredData(
          data.data.sort((a, b) => (moment(a.fullDate).isBefore(b.fullDate) ? -1 : moment(a.fullDate).isAfter(b.fullDate) ? 1 : 0))
        );
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }, [isFocused]);

  const onChangeFilter = (filterValue) => {
    setSelectedFilter(filterValue);

    switch (filterValue) {
      case "Courses":
        setFilteredData(
          attendanceData.sort((a, b) => (moment(a.fullDate).isBefore(b.fullDate) ? -1 : moment(a.fullDate).isAfter(b.fullDate) ? 1 : 0))
        );
        break;

      case "Attended":
        setFilteredData(
          attendanceData
            .filter((item) => item.present === true)
            .sort((a, b) => (moment(a.fullDate).isBefore(b.fullDate) ? -1 : moment(a.fullDate).isAfter(b.fullDate) ? 1 : 0))
        );
        break;

      case "Missed":
        api
          .get("attendance/missed", {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          })
          .then(({ data }) => {
            setFilteredData(
              data.data.sort((a, b) => (moment(a.fullDate).isBefore(b.fullDate) ? -1 : moment(a.fullDate).isAfter(b.fullDate) ? 1 : 0))
            );
          })
          .catch((error) => console.log(error));
        break;

      case "LastWeek": {
        setFilteredData(
          attendanceData
            .filter((item) => moment().subtract(7, "days").isBefore(item.fullDate) && moment().isAfter(item.fullDate))
            .sort((a, b) => (moment(a.fullDate).isBefore(b.fullDate) ? -1 : moment(a.fullDate).isAfter(b.fullDate) ? 1 : 0))
        );

        break;
      }

      case "LastMonth":
        setFilteredData(
          attendanceData
            .filter((item) => moment().subtract(1, "month").isSame(item.fullDate, "month"))
            .sort((a, b) => (moment(a.fullDate).isBefore(b.fullDate) ? -1 : moment(a.fullDate).isAfter(b.fullDate) ? 1 : 0))
        );

        break;
    }
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        filteredData.length !== 0 ? (
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  marginLeft: 10,
                  marginBottom: 15,
                  marginTop: 5,
                }}
              >
                Filter by:{" "}
              </Text>
            </View>
            <View style={{ marginLeft: 10, marginTop: -6 }}>
              <Picker
                selectedValue={selectedFilter}
                style={{ height: 50, width: 160 }}
                mode={"dialog"}
                onValueChange={(itemValue) => {
                  onChangeFilter(itemValue);
                }}
              >
                {user.themePreference === "dark" ? (
                  <Picker.Item color="#a6a6a6" label="Courses" value="Courses" />
                ) : (
                  <Picker.Item label="Courses" value="Courses" />
                )}

                {user.themePreference === "dark" ? (
                  <Picker.Item color="#a6a6a6" label="Attended" value="Attended" />
                ) : (
                  <Picker.Item label="Attended" value="Attended" />
                )}

                {user.themePreference === "dark" ? (
                  <Picker.Item color="#a6a6a6" label="Missed" value="Missed" />
                ) : (
                  <Picker.Item label="Missed" value="Missed" />
                )}

                {user.themePreference === "dark" ? (
                  <Picker.Item color="#a6a6a6" label="Last week" value="LastWeek" />
                ) : (
                  <Picker.Item label="Last week" value="LastWeek" />
                )}

                {user.themePreference === "dark" ? (
                  <Picker.Item color="#a6a6a6" label="Last month" value="LastMonth" />
                ) : (
                  <Picker.Item label="Last month" value="LastMonth" />
                )}
              </Picker>
              <FlatList keyExtractor={(item) => item.id} data={filteredData} renderItem={({ item }) => <AttendanceItem item={item} />} />
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 20 }}>You don't have any attendance record yet!</Text>
              <Text style={{ textAlign: "center" }}>Attendances will be displayed after your first attendance.</Text>
            </View>
          </View>
        )
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
    margin: 12,
    height: "97%",
  },
});

export default Attendance;
