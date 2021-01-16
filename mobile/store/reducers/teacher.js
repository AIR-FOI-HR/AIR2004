const initialState = {
  attendanceToken: null,
  courseSelectedOnTablet: null,
  trackingStarted: false,
  courses: null,
  lectures: null,
};

const teacherReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGN_IN_TABLET":
      return {
        ...state,
        attendanceToken: action.attendanceToken,
      };
    case "SIGN_OUT_TABLET":
      return {
        ...state,
        attendanceToken: null,
        courseSelectedOnTablet: null,
      };

    case "SET_COURSE_SELECTED_ON_TABLET":
      return {
        ...state,
        courseSelectedOnTablet: action.courseSelectedOnTablet,
      };

    case "START_TRACKING":
      return {
        ...state,
        trackingStarted: true,
      };
    case "SET_COURSES":
      return {
        ...state,
        courses: action.courses,
      };
    case "SET_LECTURES":
      return {
        ...state,
        lectures: action.lectures,
      };

    case "ADD_COURSE":
      return {
        ...state,
        courses: [...state.courses, action.course],
      };

    default:
      return state;
  }
};

export default teacherReducer;
