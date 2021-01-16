import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import AttendanceItem from "../student/components/AttendanceItem";

import api from "../../utils/api";

const moment = require("moment");

const Attendance = () => {
  const [selectedFilter, setSelectedFilter] = useState("Courses");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const user = useSelector((state) => state.userState);

  useEffect(() => {
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
          data.data.sort((a, b) =>
            moment(a.fullDate).isBefore(b.fullDate)
              ? -1
              : moment(a.fullDate).isAfter(b.fullDate)
              ? 1
              : 0
          )
        );
      })
      .catch((error) => console.log(error));
  }, []);

  const onChangeFilter = (filterValue) => {
    setSelectedFilter(filterValue);

    switch (filterValue) {
      case "Courses":
        setFilteredData(
          attendanceData.sort((a, b) =>
            moment(a.fullDate).isBefore(b.fullDate)
              ? -1
              : moment(a.fullDate).isAfter(b.fullDate)
              ? 1
              : 0
          )
        );
        break;

      case "Attended":
        setFilteredData(
          attendanceData
            .filter((item) => item.present === true)
            .sort((a, b) =>
              moment(a.fullDate).isBefore(b.fullDate)
                ? -1
                : moment(a.fullDate).isAfter(b.fullDate)
                ? 1
                : 0
            )
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
              data.data.sort((a, b) =>
                moment(a.fullDate).isBefore(b.fullDate)
                  ? -1
                  : moment(a.fullDate).isAfter(b.fullDate)
                  ? 1
                  : 0
              )
            );
          })
          .catch((error) => console.log(error));
        break;

      case "LastWeek": {
        setFilteredData(
          attendanceData
            .filter(
              (item) =>
                moment().subtract(7, "days").isBefore(item.fullDate) &&
                moment().isAfter(item.fullDate)
            )
            .sort((a, b) =>
              moment(a.fullDate).isBefore(b.fullDate)
                ? -1
                : moment(a.fullDate).isAfter(b.fullDate)
                ? 1
                : 0
            )
        );

        break;
      }

      case "LastMonth":
        setFilteredData(
          attendanceData
            .filter((item) =>
              moment().subtract(1, "month").isSame(item.fullDate, "month")
            )
            .sort((a, b) =>
              moment(a.fullDate).isBefore(b.fullDate)
                ? -1
                : moment(a.fullDate).isAfter(b.fullDate)
                ? 1
                : 0
            )
        );

        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
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

        <View style={{ marginLeft: 10, marginTop: -6 }}>
          <Picker
            selectedValue={selectedFilter}
            style={{ height: 50, width: 160 }}
            mode={"dialog"}
            onValueChange={(itemValue) => {
              onChangeFilter(itemValue);
            }}
          >
            <Picker.Item label="Courses" value="Courses" />
            <Picker.Item label="Attended" value="Attended" />
            <Picker.Item label="Missed" value="Missed" />
            <Picker.Item label="Last week" value="LastWeek" />
            <Picker.Item label="Last month" value="LastMonth" />
          </Picker>
        </View>
      </View>

      {filteredData.length !== 0 ? (
        <FlatList
          keyExtractor={(item) => item.id}
          data={filteredData}
          renderItem={({ item }) => <AttendanceItem item={item} />}
        />
      ) : (
        <View style={{ marginLeft: 20 }}>
          <MaterialCommunityIcons name="cloud-sync-outline" size={26} />
          <Text style={styles.font}>No data found!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
});

export default Attendance;
