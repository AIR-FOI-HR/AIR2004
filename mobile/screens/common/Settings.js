/* eslint-disable prettier/prettier */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import BlankSpacer from "react-native-blank-spacer";
import { Modal, Portal, RadioButton, Switch, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/actions/user";
import * as Biometrics from "../../utils/biometrics";

const Settings = () => {
  const dispatch = useDispatch();
  const themePreference = useSelector((state) => state.userState.themePreference);

  const theme = useTheme();
  const isDarkTheme = theme.dark;
  console.log("THEME PREFS SETTINGS", theme);

  const [isSwitchOn, setIsSwitchOn] = useState();
  const [biometricsAvailable, setBiometricsAvailable] = useState();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const showThemeModal = () => setThemeModalVisible(true);
  const hideThemeModal = () => setThemeModalVisible(false);

  useEffect(() => {
    const initialLoad = async () => {
      // Biometrics
      const biometricAuthenticationPreference = await Biometrics.checkBiometricAuthenticationPreference();
      const isEligibleForBiometricAuthentication = await Biometrics.isEligibleForBiometricAuthentication();
      console.log("BIOMETRIC AUTHENTICATION PREFERENCE", biometricAuthenticationPreference);
      setIsSwitchOn(biometricAuthenticationPreference);
      setBiometricsAvailable(isEligibleForBiometricAuthentication);
    };
    initialLoad();
  }, []);

  const onToggleSwitch = async () => {
    const authenticated = await Biometrics.handleAuthentication();
    if (authenticated) {
      AsyncStorage.setItem("biometricAuthenticationPreference", (!isSwitchOn).toString());
      setIsSwitchOn(!isSwitchOn);
    }
  };

  const onChangeThemePreference = async (themePreference) => {
    await AsyncStorage.setItem("themePreference", themePreference);
    hideThemeModal();
    dispatch(setTheme(themePreference));
  };

  const containerStyle = { margin: 20, padding: 20, backgroundColor: isDarkTheme ? "#202020" : "#FFF", borderRadius: 10, elevation: 4 };

  return (
    <View style={styles.container}>
      {biometricsAvailable == true && (
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcon name="fingerprint" size={34} color={isDarkTheme ? "#fff" : "#000"} />
          <BlankSpacer width={10} />
          <Text style={{ flex: 1, fontSize: 17 }}>Biometric authentication</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch}></Switch>
        </View>
      )}
      <BlankSpacer height={30} />
      <Pressable onPress={showThemeModal}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcon name="palette-outline" size={34} color={isDarkTheme ? "#fff" : "#000"} />
          <BlankSpacer width={10} />

          <View style={{ display: "flex" }}>
            <Text style={{ flex: 1, fontSize: 17 }}>Theme</Text>
            <BlankSpacer height={3} />
            <Text style={{ flex: 1, fontSize: 12, textTransform: "capitalize" }}>
              {themePreference == null || themePreference == "systemDefault" ? "System default" : themePreference}
            </Text>
          </View>
        </View>
      </Pressable>
      <Portal>
        <Modal visible={themeModalVisible} onDismiss={hideThemeModal} contentContainerStyle={containerStyle}>
          <View>
            <Pressable
              onPress={() => onChangeThemePreference("light")}
              style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
              <RadioButton value="light" status={themePreference == "light" ? "checked" : "unchecked"} />
              <Text style={{ color: isDarkTheme ? "#fff" : "#000" }}>Light</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => onChangeThemePreference("dark")}
              style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
              <RadioButton value="dark" status={themePreference == "dark" ? "checked" : "unchecked"} />
              <Text style={{ color: isDarkTheme ? "#fff" : "#000" }}>Dark</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              onPress={() => onChangeThemePreference("systemDefault")}
              style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
              <RadioButton value="systemDefault" status={themePreference === "systemDefault" ? "checked" : "unchecked"} />
              <Text style={{ color: isDarkTheme ? "#fff" : "#000" }}>System default</Text>
            </Pressable>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
  },
});

export default Settings;
