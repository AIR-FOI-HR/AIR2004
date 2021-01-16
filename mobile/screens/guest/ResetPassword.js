import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Text } from "react-native";
import { useDispatch } from "react-redux";
import { HelperText, TextInput, Button } from "react-native-paper";
import * as Yup from "yup";

import api from "../../utils/api";
import ResetForm from "./components/ResetForm";
import CodeForm from "./components/CodeForm";
import NewPasswordForm from "./components/NewPasswordForm";

const stages = {
  REQUEST_CODE: "REQUEST_CODE",
  VERIFY_CODE: "VERIFY_CODE",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
};

const ResetPassword = ({ navigation }) => {
  const [stage, setStage] = useState(stages.REQUEST_CODE);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  return (
    <>
      {stage === stages.REQUEST_CODE && <ResetForm setStage={setStage} setRecoveryEmail={setRecoveryEmail} />}
      {stage === stages.VERIFY_CODE && <CodeForm setStage={setStage} recoveryEmail={recoveryEmail} />}
      {stage === stages.CHANGE_PASSWORD && <NewPasswordForm setStage={setStage} recoveryEmail={recoveryEmail} navigation={navigation} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 120,
  },
});

export default ResetPassword;
