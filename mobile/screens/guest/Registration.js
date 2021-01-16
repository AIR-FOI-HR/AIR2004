import { useFormik } from "formik";
import React, { useState } from "react";
import { Alert, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as Yup from "yup";
import api from "../../utils/api";

const RegistrationSchema = Yup.object({
  email: Yup.string().email("Please enter a valid email!").required("This field is required!"),
  name: Yup.string().required("This field is required!"),
  surname: Yup.string().required("This field is required!"),
  password: Yup.string().required("This field is required!"),
  jmbag: Yup.string()
    .matches(/^[0-9]*$/, "JMBAG must only contain numbers!")
    .length(10, "JMBAG must be exactly 10 digits long!")
    .required("This field is required!"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]*$/, "Phone number must be in format 00385xxxxxxx")
    .min(10, "Phone number must be min 10 digits long!")
    .max(15, "Phone number may be max 15 digits long!")
    .required("This field is required!"),
});

const Registration = ({ navigation }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      surname: "",
      password: "",
      jmbag: "",
      phoneNumber: "",
    },
    validationSchema: RegistrationSchema,
    onSubmit: (values) => {
      handleRegistrationRequest(values);
    },
  });

  const [showHidePassword, setShowHidePassword] = useState(false);

  const handleShowHidePassword = () => {
    setShowHidePassword(!showHidePassword);
  };

  const handleRegistrationRequest = (values) => {
    api
      .post("/user/student/register", values)
      .then(({ data }) => {
        if (data.success) {
          Alert.alert("Succcessfully created a new account!");
          navigation.navigate("Login");
        }
      })
      .catch((error) => {
        console.log(error.response);
        Alert.alert("There was an issue registering your account. Please try again.");
      });
  };

  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View>
            <Image style={styles.logo} source={require("../../assets/logo.png")} />
          </View>

          <View style={{ marginTop: 60 }}>
            <TextInput
              style={styles.textInput}
              label="First Name"
              value={formik.name}
              mode="outlined"
              onChangeText={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
            />
            <HelperText type="error" visible={formik.errors.name}>
              {formik.errors.name}
            </HelperText>

            <TextInput
              style={styles.textInput}
              label="Last name"
              value={formik.surname}
              mode="outlined"
              onChangeText={formik.handleChange("surname")}
              onBlur={formik.handleBlur("surname")}
            />
            <HelperText type="error" visible={formik.errors.surname}>
              {formik.errors.surname}
            </HelperText>

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

            <TextInput
              style={styles.textInput}
              secureTextEntry={showHidePassword === true ? false : true}
              label="Password"
              value={formik.password}
              mode="outlined"
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              right={
                <TextInput.Icon
                  style={styles.eyeIcon}
                  name={showHidePassword === true ? "eye" : "eye-off"}
                  onPress={handleShowHidePassword}
                />
              }
            />
            <HelperText type="error" visible={formik.errors.password}>
              {formik.errors.password}
            </HelperText>

            <TextInput
              style={styles.textInput}
              label="JMBAG"
              value={formik.jmbag}
              mode="outlined"
              onChangeText={formik.handleChange("jmbag")}
              onBlur={formik.handleBlur("jmbag")}
            />
            <HelperText type="error" visible={formik.errors.jmbag}>
              {formik.errors.jmbag}
            </HelperText>

            <TextInput
              style={styles.textInput}
              label="Phone Number"
              value={formik.phoneNumber}
              mode="outlined"
              onChangeText={formik.handleChange("phoneNumber")}
              onBlur={formik.handleBlur("phoneNumber")}
            />
            <HelperText type="error" visible={formik.errors.phoneNumber}>
              {formik.errors.phoneNumber}
            </HelperText>
          </View>

          <View style={styles.signButton}>
            <Button contentStyle={{ height: 46 }} mode="contained" onPress={formik.handleSubmit}>
              SIGN UP
            </Button>
          </View>

          <View style={styles.textContainer}>
            <TouchableOpacity onPress={() => navigation.push("Login")}>
              <Text>Already have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
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
    marginTop: 7,
  },

  signButton: {
    width: 330,
    marginTop: 25,
  },

  textContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 50,
  },

  logo: {
    height: 130,
    width: 170,
  },

  eyeIcon: {
    marginTop: 15,
    marginRight: 10,
  },
});

export default Registration;
