import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Alert from "../../../components/Alert";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from  "react-redux";
import { teacherEdit } from "../../../store/actions/userActions";

import api from "../../../api/api";

import { yupResolver } from "@hookform/resolvers/yup";

const positiveInteger = Yup.number()
  .integer("Only integers are accepted!")
  .typeError("Only integers are accepted!")
  .positive("You need to enter a positive integer!")
  .nullable()
  .transform((value, originalValue) => (originalValue.trim() === "" ? null : value));

const validationSchema = Yup.object().shape({
  name: Yup.string().required("This field is required!"),
  surname: Yup.string().required("This field is required!"),
  email: Yup.string().required("This field is required!"),
  phoneNumber: Yup.string().required("This field is required!")
});

const EditTeacherForm = () => {
  const selectedTeacher = useSelector((state) => state.teacherEdit);

  const dispatch = useDispatch();

  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });
  const handleSnackBarClose = (event, reason) => setSnackBarData({ ...SnackbarData, isOpen: false });
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: selectedTeacher
  });
  const history = useHistory();
  const onSubmit = (data) => {
    const teacher = { data, id: selectedTeacher.id }
    console.log('teacher: ', teacher)
    
    api
      .post(`/user/update/${teacher.id}`, JSON.stringify(teacher.data), {
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
  console.log("SNACKBAR response", SnackbarData.response);

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
          value={selectedTeacher.name}
          onChange={({ target }) => dispatch(teacherEdit({...selectedTeacher, name: target.value}))}
        />
        {errors.name?.message && <Typography>{errors.name.message}</Typography>}

        <TextField
          name="surname"
          label="Surame"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="surname"
          autoComplete="surname"
          value={selectedTeacher.surname}
          onChange={({ target }) => dispatch(teacherEdit({...selectedTeacher, surname: target.value}))}
        />
        {errors.surname?.message && <Typography>{errors.surname.message}</Typography>}

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
          value={selectedTeacher.email}
          onChange={({ target }) => dispatch(teacherEdit({...selectedTeacher, email: target.value}))}
        />
        {errors.email?.message && <Typography>{errors.email.message}</Typography>}

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
          value={selectedTeacher.phoneNumber}
          onChange={({ target }) => dispatch(teacherEdit({...selectedTeacher, phoneNumber: target.value}))}
        />
        {errors.phoneNumber?.message && <Typography>{errors.phoneNumber.message}</Typography>}

        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Update teacher
        </Button>
      </form>
      <Snackbar open={SnackbarData.isOpen} autoHideDuration={4000} onClose={handleSnackBarClose}>
        {SnackbarData.response != null && (
          <Alert onClose={handleSnackBarClose} severity={SnackbarData.response == false ? "error" : "success"}>
            {SnackbarData.response == false ? "Unable to update teacher! Please check your data!" : "Teacher successfully updated!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default EditTeacherForm;

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
    margin: "auto",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "100%",
  },
}));
