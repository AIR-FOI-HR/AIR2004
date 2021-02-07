import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar, MenuItem } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Alert from "../../../components/Alert";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import ReactHookFormSelect from "../../LecturesView/components/ReactHookFormSelect";

import api from "../../../api/api";

import { yupResolver } from "@hookform/resolvers/yup";
const initialValues = {
  name: "",
  passcode: "",
  allowedAbsences: 0,
};

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

const NewCourseForm = () => {
  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const handleSnackBarClose = (event, reason) => setSnackBarData({ ...SnackbarData, isOpen: false });
  const classes = useStyles();
  const { register, handleSubmit, errors, reset, control } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const [allTeachers, setAllTeachers] = useState([]);
  useEffect(() => {
    api.get("/user/teacher").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllTeachers(response.data.data);
    });
  }, []);
  
  const history = useHistory();
  const onSubmit = (data) => {
    console.log("SUBMITTED DATA", data);
    api
      .post("/course/add", JSON.stringify(data), {
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
        />
        {errors.passcode?.message && <Typography>{errors.passcode.message}</Typography>}

        <ReactHookFormSelect
          id="teacherId"
          name="teacherId"
          label="Teacher"
          control={control}
          variant="outlined"
          margin="normal"
          defaultValue="None"
          fullWidth
        >
          {allTeachers.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.surname}
              {console.log('id: ', item.id)}
            </MenuItem>
          ))}
        </ReactHookFormSelect>

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
        />
        {errors.allowedAbsences?.message && <Typography>{errors.allowedAbsences.message}</Typography>}
        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Add new course
        </Button>
      </form>
      <Snackbar open={SnackbarData.isOpen} autoHideDuration={4000} onClose={handleSnackBarClose}>
        {SnackbarData.response != null && (
          <Alert onClose={handleSnackBarClose} severity={SnackbarData.response == false ? "error" : "success"}>
            {SnackbarData.response == false ? "Unable to add a new course! Please check your data!" : "Course successfully added!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default NewCourseForm;

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
