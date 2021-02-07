import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";
import { TextField, Button, Typography, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import MuiAlert from "@material-ui/lab/Alert";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import api from "../../api/api";
import { yupResolver } from "@hookform/resolvers/yup";

import { login } from "../../store/actions/userActions";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("This field is required!"),
  password: Yup.string().required("This field is required!"),
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });

  const classes = useStyles();

  const handleSnackBarClose = (event, reason) => {
    setSnackBarData({ ...SnackbarData, isOpen: false });
  };

  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });
  // Check in redux store if user is already logged in
  const loggedUser = useSelector((state) => state.loggedUser);
  if (loggedUser != null) {
    return <Redirect to="/" />;
  }
  // Also check if there is an entry in local storage
  const userLocalStorage = JSON.parse(localStorage.getItem("loggedUser"));
  if (userLocalStorage != null && loggedUser == null) {
    // if there is a user in local storage but not in a redux store, dispatch the login action
    dispatch(login(userLocalStorage));
    history.push("/");
  }
  const onSubmit = (data) => {
    api
      .post("/user/login", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then(({ data }) => {
        console.log("RESPONSE: ", data);
        localStorage.setItem("userToken", data.user.token);

        dispatch(login(data.user));

        history.push("/");
      })
      .catch((error) => {
        setSnackBarData({ isOpen: true, response: false });
        reset();
      });
  };

  return (
    <Grid container className={classes.container}>
      <Grid item>
        <Paper
          className={`${classes.fixedHeightPaper} ${classes.Paper}`}
          elevation={3}
        >
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              margin="normal"
              required
              inputRef={register}
              fullWidth
              id="email"
              autoComplete="email"
            />
            {errors.email?.message && (
              <Typography>{errors.email.message}</Typography>
            )}

            <TextField
              name="password"
              label="Password"
              variant="outlined"
              margin="normal"
              required
              type="password"
              inputRef={register}
              fullWidth
              id="password"
              autoComplete="password"
            />
            {errors.password?.message && (
              <Typography>{errors.password.message}</Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
          </form>
          <Snackbar
            open={SnackbarData.isOpen}
            autoHideDuration={4000}
            onClose={handleSnackBarClose}
          >
            {SnackbarData.response != null && (
              <Alert
                onClose={handleSnackBarClose}
                severity={SnackbarData.response == false ? "error" : "success"}
              >
                {SnackbarData.response == false
                  ? "Unable to login! Please check your data!"
                  : "Successfully logged in!"}
              </Alert>
            )}
          </Snackbar>
        </Paper>
        <Paper
          className={`${classes.fixedHeightPaper} ${classes.Paper}`}
          elevation={3}
        ></Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeightPaper: {
    height: 240,
  },
  Paper: {
    height: "fit-content",
    margin: "2%",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%",
  },
  container: {
    width: "100%",
    height: "500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    margin: "5%",
  },
}));

export default Login;
