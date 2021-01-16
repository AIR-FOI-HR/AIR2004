import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Alert from "../../../components/Alert";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from  "react-redux";
import { courseEdit } from "../../../store/actions/userActions";

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
  passcode: Yup.string().required("This field is required!"),
  allowedAbsences: positiveInteger,
});

const EditCourseForm = () => {
  const selectedCourse = useSelector((state) => state.courseEdit);

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
    defaultValues: selectedCourse
  });
  const history = useHistory();
  const onSubmit = (data) => {
    const course = { data, id: selectedCourse.id }
    console.log('course: ', course)
    
    api
      .post(`/course/update/${course.id}`, JSON.stringify(course.data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        setSnackBarData({ isOpen: true, response: response.data.success });
        reset();
        history.push('/courses');
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
          value={selectedCourse.name}
          onChange={({ target }) => dispatch(courseEdit({...selectedCourse, name: target.value}))}
        />
        {errors.name?.message && <Typography>{errors.name.message}</Typography>}

        <TextField
          name="passcode"
          label="Passcode"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="passcode"
          autoComplete="passcode"
          value={selectedCourse.passcode}
          onChange={({ target }) => dispatch(courseEdit({...selectedCourse, passcode: target.value}))}
        />
        {errors.passcode?.message && <Typography>{errors.passcode.message}</Typography>}

        <TextField
          name="allowedAbsences"
          label="Allowed absences"
          variant="outlined"
          margin="normal"
          required
          inputRef={register}
          fullWidth
          id="allowedAbsences"
          autoComplete="allowedAbsences"
          value={selectedCourse.allowedAbsences}
          onChange={({ target }) => dispatch(courseEdit({...selectedCourse, allowedAbsences: target.value}))}
        />
        {errors.allowedAbsences?.message && <Typography>{errors.allowedAbsences.message}</Typography>}
        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Update course
        </Button>
      </form>
      <Snackbar open={SnackbarData.isOpen} autoHideDuration={4000} onClose={handleSnackBarClose}>
        {SnackbarData.response != null && (
          <Alert onClose={handleSnackBarClose} severity={SnackbarData.response == false ? "error" : "success"}>
            {SnackbarData.response == false ? "Unable to update course! Please check your data!" : "Course successfully updated!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default EditCourseForm;

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
