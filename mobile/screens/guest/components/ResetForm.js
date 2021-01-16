import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Text } from "react-native";

import { HelperText, TextInput, Button } from "react-native-paper";
import * as Yup from "yup";
import Loading from "../../common/components/Loading";
import api from "../../../utils/api";
import { showMessage } from "react-native-flash-message";

import { useFormik } from "formik";

const ResetPasswordSchema = Yup.object({
  email: Yup.string().email("You need to enter a valid email!").required("This field is required!"),
});

const ResetForm = ({ setStage, setRecoveryEmail }) => {
  const [loading, SetLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      handleSendCode(values);
    },
  });

  const handleSendCode = (values) => {
    SetLoading(true);
    api
      .post("/user/resetCode", values)
      .then((data) => {
        if (data.data.success == true) {
          setRecoveryEmail(values.email);
          setStage("VERIFY_CODE");
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
      })
      .finally(() => {
        SetLoading(false);
      });
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.description}>
            Please provide your account e-mail address to request a password reset code. You wil receive your code to your e-mail address if
            it is valid.
          </Text>
        </View>

        <TextInput
          style={styles.textInput}
          label="E-mail"
          value={formik.email}
          mode="outlined"
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
        />
        <HelperText type="error" visible={formik.errors.email}>
          {formik.errors.email}
        </HelperText>

        <View style={styles.sendCodeButton}>
          {loading == false ? (
            <Button contentStyle={{ height: 46 }} mode="contained" onPress={formik.handleSubmit}>
              SEND CODE
            </Button>
          ) : (
            <Loading />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    textAlign: "justify",
    fontSize: 15,
    margin: 15,
    lineHeight: 25,
  },
});

export default ResetForm;
