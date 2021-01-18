import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSelector } from "react-redux";
import BlankSpacer from "react-native-blank-spacer";
import { Button } from "react-native-paper";
import { showMessage } from "react-native-flash-message";

import OTPTextInput from "react-native-otp-textinput";
import api from "../../../utils/api";

const CodeForm = ({ setStage, setResetCode }) => {
  const [otpCode, setOtpCode] = useState("");

  const user = useSelector((state) => state);

  const handleVerifyCode = () => {
    if (otpCode.length == 6) {
      api
        .post("/user/verifyResetCode", { resetCode: otpCode })
        .then((data) => {
          if (data.data.success == true) {
            setResetCode(otpCode);
            setStage("CHANGE_PASSWORD");
          }
        })
        .catch((error) => {
          showMessage({
            message: "An error has occured!",
            description: `${error.response.data.error}`,
            type: "danger",
            duration: 2500,
            icon: "danger",
          });
        });
    } else {
      alert("Please enter a valid code!");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.description}>Input the code that you received via e-mail.</Text>
        </View>

        <OTPTextInput
          inputCount={6}
          handleTextChange={(code) => setOtpCode(code)}
          textInputStyle={user.userState.themePreference === "dark" ? { color: "#FFF" } : { color: "#000" }}
        />
      </View>
      <BlankSpacer height={20} />
      <View style={styles.verifyCodeButton}>
        <Button contentStyle={{ height: 46 }} mode="contained" onPress={handleVerifyCode}>
          VERIFY CODE
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textInput: {
    width: 330,
    height: 50,
    marginTop: 25,
  },

  sendCodeButton: {
    width: 330,
    marginTop: 25,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  textContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 120,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  description: {
    textAlign: "center",
    fontSize: 15,
    margin: 15,
    lineHeight: 25,
  },
});

export default CodeForm;
