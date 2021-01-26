export const signInTablet = (attendanceToken) => {
  return {
    type: "SIGN_IN_TABLET",
    attendanceToken,
  };
};

export const setCourseSelectedOnTablet = (courseSelectedOnTablet) => {
  return {
    type: "SET_COURSE_SELECTED_ON_TABLET",
    courseSelectedOnTablet,
  };
};

export const signOutTablet = () => {
  return {
    type: "SIGN_OUT_TABLET",
  };
};

export const startTracking = () => {
  return {
    type: "START_TRACKING",
  };
};

export const setCourses = (courses) => {
  return {
    type: "SET_COURSES",
    courses,
  };
};

export const setLectures = (lectures) => {
  return {
    type: "SET_LECTURES",
    lectures,
  };
};

export const addCourse = (course) => {
  return {
    type: "ADD_COURSE",
    course,
  };
};

export const editCourse = (course) => {
  return {
    type: "EDIT_COURSE",
    course,
  };
};

export const restoreTeacherData = (teacher) => {
  return {
    type: "RESTORE_TEACHER_DATA",
    teacher,
  };
};

export const setStudentsForLecture = (students) => {
  return {
    type: "SET_STUDENTS_FOR_LECTURE",
    students,
  };
};
