import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";

const AttendanceItem = ({ item }) => {
  const user = useSelector((state) => state);

  if (item.present === undefined) {
    return (
      <View>
        <View key={item.id} style={styles.card}>
          <View>
            <Paragraph>{item.attendanceTime}</Paragraph>
            <Paragraph style={{ fontWeight: "bold" }}>
              {item.courseName}
            </Paragraph>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <Card style={styles.card}>
          <Card.Content style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 20 }}>
              <Paragraph style={{ fontSize: 30, lineHeight: 40 }}>
                {item.date}
              </Paragraph>
              <Paragraph
                style={{ fontSize: 22, lineHeight: 22, alignSelf: "center" }}
              >
                {item.month}
              </Paragraph>
            </View>

            <View>
              <Paragraph>{item.day}</Paragraph>
              <Paragraph
                style={{ fontWeight: "bold", fontSize: 16, lineHeight: 24 }}
              >
                {item.courseName}
              </Paragraph>
              {item.attendanceTime && (
                <Paragraph>{item.attendanceTime}</Paragraph>
              )}
            </View>

            <View style={{ position: "absolute", right: 10, top: 7 }}>
              {item.present && user.themePreference === "dark" && (
                <Feather name="check-circle" size={30} color="white" />
              )}

              {item.present && user.themePreference === "light" && (
                <Feather name="check-circle" size={30} color="black" />
              )}

              {!item.present && user.themePreference === "dark" && (
                <Feather name="x-circle" size={30} color="white" />
              )}

              {!item.present && user.themePreference === "light" && (
                <Feather name="x-circle" size={30} color="black" />
              )}
            </View>

            <View style={{ position: "absolute", right: 10, bottom: 7 }}>
              <Paragraph>{item.lectureType}</Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 7,
    marginBottom: 5,
    elevation: 4,
  },
});

export default AttendanceItem;
