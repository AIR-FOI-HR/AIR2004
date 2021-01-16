import React from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Dimensions, View } from "react-native";
import { StackActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { signInTablet } from "../../store/actions/teacher";
import api from "../../utils/api";

const QR = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const onScanned = (e) => {
    const attendanceToken = e.data;
    api.post("/user/login/tablet", { attendanceToken }).then(({ data }) => {
      console.log("SOCKET TOKEN", attendanceToken);
      dispatch(signInTablet(attendanceToken));

      //  console.log("USER LOGGED IN?", user.loggedInTablet)

      navigation.dispatch(StackActions.pop(1));
    });
  };

  return (
    <View>
      <QRCodeScanner onRead={onScanned} cameraStyle={{ height: Dimensions.get("window").height }} />
    </View>
  );
};

export default QR;
