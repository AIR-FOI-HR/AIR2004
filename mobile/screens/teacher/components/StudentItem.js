import React from "react";
import { View } from "react-native";

import { Card, Paragraph } from "react-native-paper";

const StudentItem = ({ student }) => {
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
          <View style={{ marginRight: 20, flexDirection: "column", alignItems: "flex-start", justifyContent: "center", flex: 1 }}>
            <Paragraph style={{ fontSize: 20, fontWeight: "bold" }}>
              {student.name} {student.surname}
            </Paragraph>
          </View>

          <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", alignSelf: "flex-end" }}>
            <Paragraph>Phone: {student.phoneNumber}</Paragraph>
            <Paragraph>JMBAG: {student.jmbag}</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default StudentItem;
