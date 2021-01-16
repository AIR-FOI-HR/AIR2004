export const signIn = (user) => {
  return {
    type: "SIGN_IN",
    user: user,
  };
};

export const signOut = () => {
  return {
    type: "SIGN_OUT",
  };
};

export const setTheme = (themePref) => {
  return {
    type: "SET_THEME",
    themePref,
  };
};
