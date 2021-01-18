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
import { HelperText, TextInput, Button, useTheme } from "react-native-paper";
import BlankSpacer from "react-native-blank-spacer";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { getUniqueId } from "react-native-device-info";

import api from "../../utils/api";
import { signIn } from "../../store/actions/user";

const LoginSchema = Yup.object({
  email: Yup.string().email("Please enter a valid email!").required("This field is required!"),
  password: Yup.string().required("This field is required!"),
});

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [showHidePassword, setShowHidePassword] = useState(false);
  const [showLoadingIndicatorLogin, setShowLoadingIndicatorLogin] = useState(false);

  const user = useSelector((state) => state.userState);

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

    api
      .post("/user/login", { email, password, deviceUID: getUniqueId() })
      .then(({ data }) => {
        dispatch(signIn(data.user));
      })
      .catch((error) => {
        Alert.alert(error.response.data.message);
      })
      .finally(() => setShowLoadingIndicatorLogin(false));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          {user.themePreference == "dark" ? (
            <Image style={styles.logo} source={require("../../assets/logo_dark.png")} />
          ) : (
            <Image style={styles.logo} source={require("../../assets/logo.png")} />
          )}
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
          <TouchableOpacity onPress={() => navigation.push("ForgottenPassword")}>
            <Text style={theme.dark == true ? styles.tooltipText : null}>Forgot password?</Text>
          </TouchableOpacity>
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
