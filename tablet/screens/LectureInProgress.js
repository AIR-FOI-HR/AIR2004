import React, { useState, useEffect } from "react";
import AnimatedLoader from "react-native-animated-loader";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useSelector } from "react-redux";
import { Headline } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import AnimatedCheckmark from "../components/AnimatedCheckmark";

const LectureInProgress = ({ courseName, lectureType, socket, tabletToken }) => {
  const user = useSelector((state) => state);

  const [successfulScan, setSuccessfulScan] = useState(false);

  useEffect(() => {
    setSuccessfulScan(true);
    setTimeout(() => setSuccessfulScan(false), 2000);
  }, [tabletToken]);

  if (tabletToken.code)
    return (
      <View style={styles.qrContainer}>
        <Text style={styles.text}>Please scan the QR code using Unittend application to mark your attendance</Text>
        {successfulScan && <AnimatedCheckmark />}
        <QRCode
          value={JSON.stringify({ code: tabletToken.code, attendanceToken: user.attendanceToken, lecture: tabletToken.lecture })}
          style={styles.qr}
          size={Dimensions.get("screen").height * 0.45}
        />
      </View>
    );

  return (
    <View style={styles.container}>
      <Headline style={styles.headline}>
        {courseName} | {lectureType}
      </Headline>
      <Headline style={styles.headline}>Lecture currently in progress</Headline>
      <AnimatedLoader
        visible={true}
        overlayColor="rgba(255,255,255,0.25)"
        source={require("../assets/9513-preloader.json")}
        animationStyle={styles.lottie}
        speed={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  qrContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-8%",
  },
  text: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  headline: {
    marginTop: "10%",
    fontWeight: "700",
    marginBottom: "2%",
  },
  lottie: {
    marginTop: "10%",
    width: 200,
    height: 200,
  },
});

export default LectureInProgress;
