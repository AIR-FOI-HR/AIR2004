export const login = (user) => {
  return {
    type: "LOG_IN",
    user,
  };
};

export const logout = () => {
  return {
    type: "LOG_OUT",
  };
};

export const courseEdit = (row) => {
  return {
    type: "EDIT_COURSE",
    selectedRow: row
  }
};

export const studentEdit = (row) => {
  return {
    type: "EDIT_STUDENT",
    selectedRow: row
  }
};

export const teacherEdit = (row) => {
  return {
    type: "EDIT_TEACHER",
    selectedRow: row
  }
};

export const lectureEdit = (row) => {
  return {
    type: "EDIT_LECTURE",
    selectedRow: row
  }
};

export const attendanceEdit = (row) => {
  return {
    type: "EDIT_ATTENDANCE",
    selectedRow: row
  }
};