const initialState = {
  loggedUser: null,
  courseEdit: null,
  studentEdit: null,
  teacherEdit: null,
  lectureEdit: null,
  attendanceEdit: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN":
      return { ...state, loggedUser: action.user };
    case "LOG_OUT":
      return initialState;
    case "EDIT_COURSE":
      return { ...state, courseEdit: action.selectedRow };
    case "EDIT_STUDENT":
      return { ...state, studentEdit: action.selectedRow };
    case "EDIT_TEACHER":
      return { ...state, teacherEdit: action.selectedRow };
    case "EDIT_LECTURE":
      return { ...state, lectureEdit: action.selectedRow };
    case "EDIT_ATTENDANCE":
      return { ...state, attendanceEdit: action.selectedRow };
    default:
      return state;
  }
};

export default userReducer;
