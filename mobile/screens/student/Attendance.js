import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Platform } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";

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
  const isDarkTheme = useTheme().dark;

  const user = useSelector((state) => state.userState);

  useEffect(() => {
    setLoading(true);
    api
      .get("/by-student")
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
          .get("attendance/missed")
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
      {!loading ? (
        attendanceData.length !== 0 && !loading ? (
          <View style={{ zIndex: 3 }}>
            <View style={{ zIndex: 3, flexDirection: "row" }}>
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

              {Platform.OS == "android" && (
                <View style={{ marginLeft: 10, marginTop: -6 }}>
                  <Picker
                    selectedValue={selectedFilter}
                    style={{ height: 50, width: 160 }}
                    mode={"dialog"}
                    onValueChange={(itemValue) => {
                      onChangeFilter(itemValue);
                    }}
                  >
                    {isDarkTheme ? (
                      <Picker.Item
                        color="#a6a6a6"
                        label="Courses"
                        value="Courses"
                      />
                    ) : (
                      <Picker.Item label="Courses" value="Courses" />
                    )}

                    {isDarkTheme ? (
                      <Picker.Item
                        color="#a6a6a6"
                        label="Attended"
                        value="Attended"
                      />
                    ) : (
                      <Picker.Item label="Attended" value="Attended" />
                    )}

                    {isDarkTheme ? (
                      <Picker.Item
                        color="#a6a6a6"
                        label="Missed"
                        value="Missed"
                      />
                    ) : (
                      <Picker.Item label="Missed" value="Missed" />
                    )}

                    {isDarkTheme ? (
                      <Picker.Item
                        color="#a6a6a6"
                        label="Last week"
                        value="LastWeek"
                      />
                    ) : (
                      <Picker.Item label="Last week" value="LastWeek" />
                    )}

                    {isDarkTheme ? (
                      <Picker.Item
                        color="#a6a6a6"
                        label="Last month"
                        value="LastMonth"
                      />
                    ) : (
                      <Picker.Item label="Last month" value="LastMonth" />
                    )}
                  </Picker>
                </View>
              )}

              {Platform.OS == "ios" && (
                <View
                  style={{
                    ...(Platform.OS !== "android"
                      ? {
                          zIndex: 10,
                        }
                      : { position: "relative" }),
                  }}
                >
                  <DropDownPicker
                    items={[
                      { label: "Courses", value: "Courses" },
                      { label: "Attended", value: "Attended" },
                      { label: "Missed", value: "Missed" },
                      { label: "Last week", value: "LastWeek" },
                      { label: "Last month", value: "LastMonth" },
                    ]}
                    style={{
                      backgroundColor: isDarkTheme ? "#272727" : "#fff",
                    }}
                    arrowColor={isDarkTheme ? "#fff" : "#000"}
                    labelStyle={{ color: isDarkTheme ? "#fff" : "#000" }}
                    defaultValue={"Courses"}
                    containerStyle={{ height: 40, width: 200 }}
                    dropDownStyle={{
                      backgroundColor: isDarkTheme ? "#272727" : "#fff",
                    }}
                    itemStyle={{
                      flexDirection: "column",
                    }}
                    onChangeItem={(item) => onChangeFilter(item.value)}
                  />
                </View>
              )}
            </View>
            {filteredData.length !== 0 ? (
              <View style={{ height: "94%" }}>
                <FlatList
                  keyExtractor={(item) => item.id}
                  data={filteredData}
                  renderItem={({ item }) => <AttendanceItem item={item} />}
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  marginTop: "-10%",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "500",
                  }}
                >
                  There is no attendance data for specified filter!
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View>
              <Text
                style={{ fontSize: 19, fontWeight: "500", marginBottom: 20 }}
              >
                You don't have any attendance record yet!
              </Text>
              <Text style={{ textAlign: "center" }}>
                Attendances will be displayed after your first attendance.
              </Text>
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
