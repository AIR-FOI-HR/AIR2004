import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar } from "@material-ui/core";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from "react-router-dom";

import Alert from "../../../components/Alert";
import api from "../../../api/api";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  Paper: {
    height: "fit-content",
  },
  form: {
    width: "60%",
    marginTop: theme.spacing(1),
    margin: "auto"
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%",
  },
}));

const initialValues = {
  email: "",
  password: "",
  phoneNumber: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("This field is required!"),
  surname: Yup.string()
  .required("This field is required!"),
  email: Yup.string()
    .email("You need to enter a valid email!")
    .required("This field is required!"),
  password: Yup.string().required("This field is required!"),
  phoneNumber: Yup.string()
    .min(10, "Phone number must be 10-15 characters long!")
    .max(15, "Phone number must be 10-15 characters long!")
    .required("This field is required!"),
});

const NewTeacherForm = () => {
  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });
  const handleSnackBarClose = (event, reason) =>
    setSnackBarData({ ...SnackbarData, isOpen: false });
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });
  const history = useHistory();

  const onSubmit = (data) => {
    console.log("FORM DATA", data);
    api
      .post("/user/teacher/register", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        setSnackBarData({ isOpen: true, response: response.data.success });
        reset();
        history.push('/teachers');
      })
      .catch((error) => {
        setSnackBarData({ isOpen: true, response: false });
        reset();
      });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="name"
          autoComplete="name"
        />
        {errors.name?.message && (
          <Typography>{errors.name.message}</Typography>
        )}

        <TextField
          name="surname"
          label="Surname"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="surname"
          autoComplete="surname"
        />
        {errors.surname?.message && (
          <Typography>{errors.surname.message}</Typography>
        )}

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

        <TextField
          name="phoneNumber"
          label="Phone number"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="phoneNumber"
          autoComplete="phoneNumber"
        />
        {errors.phoneNumber?.message && (
          <Typography>{errors.phoneNumber.message}</Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Add new teacher
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
              ? "Unable to register new teacher! Please check your data!"
              : "Successfully registered new teacher!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default NewTeacherForm;
