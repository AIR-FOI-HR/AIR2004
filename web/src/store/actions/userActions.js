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