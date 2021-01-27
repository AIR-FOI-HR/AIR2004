import React from "react";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Dimensions, View } from "react-native";
import { showMessage } from "react-native-flash-message";

import api from "../../utils/api";
import { useSelector } from "react-redux";

const QR = ({ navigation }) => {
  const user = useSelector((state) => state.userState.userId);

  const onScanned = async (e) => {
    try {
      const qrCodeData = JSON.parse(e.data);
      await api.post("/attendance/mark", { ...qrCodeData, user });

      showMessage({
        message: "Thank you!",
        description: "Your attendance has been saved!",
        type: "success",
        duration: 5000,
        icon: "success",
      });
    } catch (error) {
      console.log("ERRORRRR", error.response.data);
      showMessage({
        message: "Error occured!",
        description:
          "You either scanned an invalid QR code or you have already marked your attendance to this lecture. If you think this is an error, please ask the teacher for assitance.",
        type: "danger",
        duration: 7000,
        icon: "danger",
      });
    } finally {
      navigation.pop();
    }
  };

  return (
    <View>
      <QRCodeScanner onRead={onScanned} showMarker={true} cameraStyle={{ height: Dimensions.get("window").height }} />
    </View>
  );
};

export default QR;
