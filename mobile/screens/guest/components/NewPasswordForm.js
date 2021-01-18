import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Text } from "react-native";

import { HelperText, TextInput, Button } from "react-native-paper";
import * as Yup from "yup";
import api from "../../../utils/api";
import { useFormik } from "formik";
import { showMessage } from "react-native-flash-message";

const NewPasswordSchema = Yup.object({
  password: Yup.string().required("This field is required!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match!")
    .required("This field is required!"),
});

const NewPasswordForm = ({ navigation, resetCode }) => {
  const [showHidePassword, setShowHidePassword] = useState(false);
  const [showHideConfirmPassword, setShowHideConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: NewPasswordSchema,
    onSubmit: (values) => {
      handleChangePassword(values);
    },
  });

  const handleShowHidePassword = () => {
    setShowHidePassword(!showHidePassword);
  };

  const handleShowHideConfirmPassword = () => {
    setShowHideConfirmPassword(!showHideConfirmPassword);
  };

  const handleChangePassword = (values) => {
    console.log("VALUES", values);
    api.post("/user/resetPassword", { ...values, resetCode }).then((data) => {
      console.log("DATA", data.data);
      if (data.data.success == true) {
        showMessage({
          message: "Password changed!",
          description: `You have successfully changed your password! Please log in using your new password.`,
          type: "success",
          duration: 2500,
          icon: "success",
        });
        navigation.goBack();
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Reset Your Password</Text>
          <Text style={styles.description}>Enter your new password below.</Text>
        </View>

        <TextInput
          style={styles.textInput}
          label="Password"
          value={formik.password}
          secureTextEntry={showHidePassword === true ? false : true}
          mode="outlined"
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          right={
            <TextInput.Icon style={styles.eyeIcon} name={showHidePassword === true ? "eye" : "eye-off"} onPress={handleShowHidePassword} />
          }
        />
        <HelperText type="error" visible={formik.errors.password}>
          {formik.errors.password}
        </HelperText>

        <TextInput
          style={styles.textInput}
          label="Confirm password"
          secureTextEntry={showHideConfirmPassword === true ? false : true}
          value={formik.confirmPassword}
          mode="outlined"
          onChangeText={formik.handleChange("confirmPassword")}
          onBlur={formik.handleBlur("confirmPassword")}
          right={
            <TextInput.Icon
              style={styles.eyeIcon}
              name={showHideConfirmPassword === true ? "eye" : "eye-off"}
              onPress={handleShowHideConfirmPassword}
            />
          }
        />
        <HelperText type="error" visible={formik.errors.confirmPassword}>
          {formik.errors.confirmPassword}
        </HelperText>

        <View style={styles.sendCodeButton}>
          <Button contentStyle={{ height: 46 }} mode="contained" onPress={formik.handleSubmit}>
            CHANGE PASSWORD
          </Button>
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

  eyeIcon: {
    marginTop: 15,
    marginRight: 10,
  },
});

export default NewPasswordForm;
