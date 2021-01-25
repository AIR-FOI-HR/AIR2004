import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  Surface,
  Card,
  Paragraph,
  DefaultTheme,
  Provider as PaperProvider,
  FAB,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { showMessage, hideMessage } from "react-native-flash-message";

import Loading from "../common/components/Loading";

import api from "../../utils/api";

const Statistics = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const user = useSelector((state) => state.userState);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/details")
      .then(({ data }) => {
        setEnrolledCourses(data.data.enrolledCourses);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View>
      {!loading ? (
        <View style={styles.container}>
          <View style={styles.courseContainer}>
            {enrolledCourses.length !== 0 && !loading ? (
              <View>
                <Text
                  style={
                    (styles.font,
                    {
                      margin: 12,
                      marginBottom: 5,
                      fontWeight: "bold",
                      color: "#626262",
                    })
                  }
                >
                  Select course to see statistics
                </Text>

                <FlatList
                  keyExtractor={(item) => item.id}
                  data={enrolledCourses}
                  extraData={enrolledCourses.length}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableWithoutFeedback
                        key={item.id}
                        onPress={() => {
                          navigation.push("CourseStatistics", {
                            courseId: item.id,
                            selectedCourse: item.name,
                          });
                        }}
                      >
                        <Card
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 7,
                            marginBottom: 7,
                            elevation: 4,
                          }}
                        >
                          <Card.Content>
                            <Paragraph style={{ fontWeight: "bold" }}>
                              {item.name}
                            </Paragraph>
                          </Card.Content>
                        </Card>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                />
              </View>
            ) : (
              <View
                style={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 19,
                    fontWeight: "500",
                    marginBottom: 20,
                  }}
                >
                  You don't have any course enrolled yet!
                </Text>
                <Text style={{ textAlign: "center" }}>
                  Courses will be displayed after your first enroll on course.
                </Text>
              </View>
            )}
          </View>
        </View>
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
    width: "100%",
    height: "100%",
  },

  courseContainer: {
    marginTop: 5,
    elevation: 4,
  },

  font: {
    fontSize: 14,
  },
});

export default Statistics;
