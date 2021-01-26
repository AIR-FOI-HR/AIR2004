import React from "react";
import { View, Text } from "react-native";

import BlankSpacer from "react-native-blank-spacer";
import { Card, Paragraph, IconButton } from "react-native-paper";
import { useTheme } from "react-native-paper";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
const LectureItem = ({ lecture, navigation }) => {
  const isDarkTheme = useTheme().dark;

  return (
    <View>
      <Card
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 7,
          marginBottom: 5,
        }}
      >
        <Card.Content style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 20, flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
            <Paragraph style={{ fontSize: 30, lineHeight: 40 }}>{lecture.date}</Paragraph>
            <Paragraph style={{ fontSize: 22, lineHeight: 22, alignSelf: "center" }}>{lecture.month}</Paragraph>
          </View>

          <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
            <Paragraph>{lecture.day}</Paragraph>
            <Paragraph style={{ fontWeight: "bold", fontSize: 16, lineHeight: 24 }}>{lecture.courseName}</Paragraph>
          </View>

          <View style={{ flexDirection: "column", flex: 1, alignItems: "flex-end", justifyContent: "flex-start", alignSelf: "flex-start" }}>
            <Text style={{ color: `${isDarkTheme == true ? "#FFF" : "#000"}`, fontSize: 12 }}>
              {lecture.timeStart} - {lecture.timeEnd}
            </Text>
            <Paragraph>{lecture.lectureType}</Paragraph>
            <BlankSpacer height={10} />
            <IconButton
              icon={() => <MaterialIcon name="people-outline" size={35} color={isDarkTheme == true ? "#FFF" : "#000"} />}
              onPress={() => navigation.navigate("Students", { lecture: lecture, navigation })}
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default LectureItem;
