import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { Dialog, Portal, HelperText, TextInput, Button, useTheme } from "react-native-paper";
import BlankSpacer from "react-native-blank-spacer";
import { useFormik } from "formik";
import * as Yup from "yup";

import api from "../../utils/api";
import { signIn } from "../../store/actions/user";
import AnimatedCheckmark from "./components/AnimatedCheckmark";
import AnimatedDotsLoader from "./components/AnimatedLoader";

const LoginSchema = Yup.object({
  email: Yup.string().email("Please enter a valid email!").required("This field is required!"),
  password: Yup.string().required("This field is required!"),
});

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [emailChangePassword, setEmailChangePassword] = useState("");
  const [showHidePassword, setShowHidePassword] = useState(false);
  const [showLoadingIndicatorLogin, setShowLoadingIndicatorLogin] = useState(false);

  const [animatedLoaderVisible, setAnimatedLoaderVisible] = useState(false);
  const [animatedCheckmarkVisible, setAnimatedCheckMarkVisible] = useState(false);
  const [visible, toggleVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      handleLoginRequest(values);
    },
  });

  const handleShowHidePassword = () => {
    setShowHidePassword(!showHidePassword);
  };

  const handleLoginRequest = (values) => {
    const { email, password } = values;
    setShowLoadingIndicatorLogin(true);
    toggleVisible(false);

    api
      .post("/user/login", { email, password })
      .then(({ data }) => {
        console.log(data);
        setShowLoadingIndicatorLogin(false);
        dispatch(signIn(data.user));
      })
      .catch((error) => {
        console.log(error);
        setShowLoadingIndicatorLogin(false);
        Alert.alert("Invalid credentials!");
      });
  };

  const handleResetPassword = () => {
    setAnimatedLoaderVisible(true);
    api
      .post("/user/resetPassword", { email: emailChangePassword })
      .then((data) => {
        setAnimatedLoaderVisible(false);
        console.log("DATA", data);
        if (data.data.success == true) {
          setAnimatedCheckMarkVisible(true);
          setTimeout(() => {
            setAnimatedCheckMarkVisible(false);
            toggleVisible(false);
          }, 1500);
        }
      })
      .catch((error) => {
        setAnimatedLoaderVisible(false);
        if (error.response.status == 400) {
          alert("There has been an error processing your request, please check your input!");
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <Image style={styles.logo} source={require("../../assets/logo_dark.png")} />
        </View>

        <View>
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
        </View>

        <View style={styles.signButton}>
          <Button contentStyle={{ height: 46 }} mode="contained" onPress={formik.handleSubmit}>
            SIGN IN
          </Button>

          <View style={{ marginTop: 10 }}>{showLoadingIndicatorLogin && <ActivityIndicator size="large" color="#0000ff" />}</View>
        </View>

        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => navigation.push("Registration")}>
            <Text style={theme.dark == true ? styles.tooltipText : null}>Don't have an account?</Text>
          </TouchableOpacity>
          <BlankSpacer height={50} />
          <TouchableOpacity onPress={() => toggleVisible(true)}>
            <Text style={theme.dark == true ? styles.tooltipText : null}>Forgot password?</Text>
          </TouchableOpacity>

          <Portal>
            <Dialog
              visible={visible}
              onDismiss={() => {
                toggleVisible(false);
                setEmailChangePassword("");
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginRight: 20,
                }}
              >
                <Dialog.Title>Reset password</Dialog.Title>
              </View>
              <Dialog.Content>
                <TextInput
                  label="Enter your email"
                  value={emailChangePassword}
                  mode="outlined"
                  onChangeText={(emailChangePassword) => setEmailChangePassword(emailChangePassword)}
                />
                {animatedLoaderVisible && <AnimatedDotsLoader />}
                {animatedCheckmarkVisible && <AnimatedCheckmark />}
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    toggleVisible(false);
                    setEmailChangePassword("");
                  }}
                >
                  Close
                </Button>
                <Button onPress={() => handleResetPassword()}>Reset Password</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
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

  signButton: {
    width: 330,
    marginTop: 25,
  },

  textContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 120,
  },

  logo: {
    height: 140,
    width: 170,
  },

  eyeIcon: {
    marginTop: 15,
    marginRight: 10,
  },

  loginIndicator: {
    position: "absolute",
  },
  tooltipText: {
    color: "white",
  },
});

export default Login;
