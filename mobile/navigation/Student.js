import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import Dashboard from "../screens/student/Dashboard";
import Attendance from "../screens/student/Attendance";
import Statistics from "../screens/student/Statistics";

import { signOut } from "../actions";

import {  View } from "react-native";
import QR from "../screens/student/QR";
import CourseStatistics from '../screens/student/CourseStatistics';

const Stack = createStackNavigator();

const Tabs = createMaterialBottomTabNavigator();

const StudentTabNavigation = () => {
  return (

    <Tabs.Navigator
      barStyle={{ backgroundColor: '#6202EE' }}
    >
      <Tabs.Screen
        name="Dashboard" 
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcons name="home" color={color} size={22}/>
          ),
        }} 
      />

      <Tabs.Screen
        name="Attendance" 
        component={Attendance}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcons name="list" color={color} size={22} />
          ),
        }} 
      />

      <Tabs.Screen
        name="Statistics" 
        component={Statistics}
        options={{
          tabBarLabel: 'Statistics',
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcons name="chart-pie" color={color} size={22} />
          ),
        }} 
      />
    </Tabs.Navigator>
  );
};

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';

  switch (routeName) {
    case 'Dashboard':
      return 'Dashboard';
    case 'Attendance':
      return 'Your Attendance';
    case 'Statistics':
      return 'Statistics';
  }
}

const Student = () => {
  const dispatch = useDispatch();

  return(
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={StudentTabNavigation} 
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          headerTintColor: 'white', 
          headerStyle: { backgroundColor: '#6202EE' },
          headerRight: () => (
            <View style={{marginRight: 15}}>
              <MaterialIcons name="logout" size={26} color={"white"} onPress={() => dispatch(signOut())}/>
            </View>
          )
        })}
      />

      <Stack.Screen
        name="QRScan"
        component={QR}
        options={{
          headerTitle: "Scan QR code",
          headerTintColor: 'white', 
          headerStyle: { backgroundColor: '#6202EE' },
        }}
      /> 

      <Stack.Screen 
        name="Statistics" 
        component={StudentTabNavigation} 
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          headerTintColor: 'white', 
          headerStyle: { backgroundColor: '#6202EE' },
          headerRight: () => (
            <View style={{marginRight: 15}}>
              <MaterialIcons name="logout" size={26} color={"white"} onPress={() => dispatch(signOut())}/>
            </View>
          )
        })}
      />

      <Stack.Screen
        name="CourseStatistics"
        component={CourseStatistics}
        options={({ route }) => ({
          headerTitle: "Statistics: " + route.params.selectedCourse,
          headerTintColor: 'white', 
          headerStyle: { backgroundColor: '#6202EE' },
        })}
      /> 

    </Stack.Navigator>
  );
};


export default Student;