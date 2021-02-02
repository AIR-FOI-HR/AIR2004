import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Alert from "../../../components/Alert";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from  "react-redux";
import { studentEdit } from "../../../store/actions/userActions";

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
  passcode: Yup.string().required("This field is required!"),
  email: Yup.string().required("This field is required!"),
  jmbag: Yup.string().required("This field is required!"),
  phoneNumber: Yup.string().required("This field is required!")
});

const EditStudentForm = () => {
  const selectedStudent = useSelector((state) => state.studentEdit);
  
  const dispatch = useDispatch();

  const resetUID = () => {
    api
      .put(`/user/reset-uid/${selectedStudent.id}`, JSON.stringify(selectedStudent.data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        history.push('/students');
      })
      .catch((error) => {
        setSnackBarData({ isOpen: true, response: false });
        reset();
      });
  };

  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });
  const handleSnackBarClose = (event, reason) => setSnackBarData({ ...SnackbarData, isOpen: false });
  const classes = useStyles();
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: selectedStudent
  });
  const history = useHistory();
  const onSubmit = (data) => {
    const student = { data, id: selectedStudent.id }
    console.log('student: ', student)
    
    api
      .post(`/user/update/${student.id}`, JSON.stringify(student.data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        setSnackBarData({ isOpen: true, response: response.data.success });
        reset();
        history.push('/students');
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
          value={selectedStudent.name}
          onChange={({ target }) => dispatch(studentEdit({...selectedStudent, name: target.value}))}
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
          value={selectedStudent.surname}
          onChange={({ target }) => dispatch(studentEdit({...selectedStudent, surname: target.value}))}
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
          value={selectedStudent.email}
          onChange={({ target }) => dispatch(studentEdit({...selectedStudent, email: target.value}))}
        />
        {errors.email?.message && <Typography>{errors.email.message}</Typography>}

        <TextField
          name="jmbag"
          label="Jmbag"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="jmbag"
          autoComplete="jmbag"
          value={selectedStudent.jmbag}
          onChange={({ target }) => dispatch(studentEdit({...selectedStudent, jmbag: target.value}))}
        />
        {errors.jmbag?.message && <Typography>{errors.jmbag.message}</Typography>}

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
          value={selectedStudent.phoneNumber}
          onChange={({ target }) => dispatch(studentEdit({...selectedStudent, phoneNumber: target.value}))}
        />
        {errors.phoneNumber?.message && <Typography>{errors.phoneNumber.message}</Typography>}

        <Button type="submit" variant="contained" color="secondary" className={classes.resetUID}
          onClick={resetUID}>Reset device ID
        </Button>

        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Update student
        </Button>
      </form>
      <Snackbar open={SnackbarData.isOpen} autoHideDuration={4000} onClose={handleSnackBarClose}>
        {SnackbarData.response != null && (
          <Alert onClose={handleSnackBarClose} severity={SnackbarData.response == false ? "error" : "success"}>
            {SnackbarData.response == false ? "Unable to update student! Please check your data!" : "Student successfully updated!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default EditStudentForm;

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
  resetUID: {
    float: 'right'
  }
}));
