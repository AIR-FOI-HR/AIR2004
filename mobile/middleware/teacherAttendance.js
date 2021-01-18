import AsyncStorage from "@react-native-async-storage/async-storage";

const teacherAttendanceMiddleware = (store) => (next) => async (action) => {
  let teacherState = store.getState().teacherState;

  if (action.type == "SIGN_IN_TABLET") {
    teacherState = { ...teacherState, attendanceToken: action.attendanceToken };
  }

  if (action.type == "SIGN_OUT_TABLET") {
    teacherState = { ...teacherState, attendanceToken: null, courseSelectedOnTablet: null };
  }

  if (action.type == "SET_COURSE_SELECTED_ON_TABLET") {
    teacherState = { ...teacherState, courseSelectedOnTablet: action.courseSelectedOnTablet };
  }

  if (action.type == "START_TRACKING") {
    teacherState = { ...teacherState, trackingStarted: true };
  }

  await AsyncStorage.setItem("teacher", JSON.stringify(teacherState));

  next(action);
};

export default teacherAttendanceMiddleware;
