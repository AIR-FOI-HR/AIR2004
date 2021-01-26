import React, { useState } from "react";
import { StyleSheet } from "react-native";

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
  const [resetCode, setResetCode] = useState("");

  return (
    <>
      {stage === stages.REQUEST_CODE && <ResetForm setStage={setStage} />}
      {stage === stages.VERIFY_CODE && <CodeForm setStage={setStage} setResetCode={setResetCode} />}
      {stage === stages.CHANGE_PASSWORD && <NewPasswordForm setStage={setStage} resetCode={resetCode} navigation={navigation} />}
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
