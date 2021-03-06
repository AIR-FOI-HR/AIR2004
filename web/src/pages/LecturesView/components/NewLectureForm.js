import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar, MenuItem } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Alert from "../../../components/Alert";
import ReactHookFormSelect from "./ReactHookFormSelect";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

import api from "../../../api/api";

import { yupResolver } from "@hookform/resolvers/yup";
const initialValues = {
  course: "",
  type: "",
  timeStart: "",
  timeEnd: "",
};

const validationSchema = Yup.object().shape({
  course: Yup.number().required("This field is required!"),
  type: Yup.string().required("This field is required!"),
  timeStart: Yup.date().required("This field is required!"),
  timeEnd: Yup.date().required("This field is required!"),
});

const NewLectureForm = () => {
  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });
  const handleSnackBarClose = (event, reason) => setSnackBarData({ ...SnackbarData, isOpen: false });
  const classes = useStyles();
  const { register, handleSubmit, errors, reset, control } = useForm({
    mode: "onChange",
  });

  const [allCourses, setAllCourses] = useState([]);
  useEffect(() => {
    api.get("/course").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllCourses(response.data.data);
    });
  }, []);
  const history = useHistory();
  const onSubmit = (data) => {
    console.log('lecture data: ', data);
    api
      .post("/lecture/add", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        setSnackBarData({ isOpen: true, response: response.data.success });
        reset();
        history.push('/lectures');
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

        <ReactHookFormSelect
          id="course"
          name="course"
          label="Course name"
          control={control}
          variant="outlined"
          margin="normal"
          defaultValue="None"
          fullWidth
        >
          {allCourses.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </ReactHookFormSelect>
        <ReactHookFormSelect
          id="type"
          name="type"
          label="Type"
          control={control}
          variant="outlined"
          margin="normal"
          defaultValue="None"
          fullWidth
        >
          <MenuItem value={"Lecture"}>Lecture</MenuItem>
          <MenuItem value={"Seminar"}>Seminar</MenuItem>
          <MenuItem value={"Lab"}>Lab</MenuItem>
        </ReactHookFormSelect>

        <label htmlFor="timeStart" className={classes.label}>Time start</label>
        <input name="timeStart" type="datetime-local" ref={register} className={classes.datetime}/>

        <label htmlFor="timeEnd" className={classes.label}>Time end</label>
        <input name="timeEnd" type="datetime-local" ref={register} className={classes.datetime}/>

        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Add new lecture
        </Button>
      </form>
      <Snackbar open={SnackbarData.isOpen} autoHideDuration={4000} onClose={handleSnackBarClose}>
        {SnackbarData.response != null && (
          <Alert onClose={handleSnackBarClose} severity={SnackbarData.response === false ? "error" : "success"}>
            {SnackbarData.response === false ? "Unable to add a new lecture! Please check your data!" : "Lecture successfully added!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default NewLectureForm;

const useStyles = makeStyles((theme) => ({
  datetime: {
    height: "45px",
    margin: "10px 0px",
    width: "100%",
    borderRadius: "4px",
    color: "rgba(0, 0, 0, 0.87)",
    appearance: "none",
    borderColor: "white"
  },
  label: {
    color: "rgba(0, 0, 0, 0.54)",
    padding: 0,
    fontSize: "13px",
    fontFamily: "Roboto Helvetica Arial sans-serif",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "0.00938em",
  },
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
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  dateTime: {
    display: "flex",
    justifyContent: "space-between",
    width: "auto"
  }
}));
