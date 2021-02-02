import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Snackbar, MenuItem } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Alert from "../../../components/Alert";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from  "react-redux";
import { lectureEdit } from "../../../store/actions/userActions";
import ReactHookFormSelect from "./ReactHookFormSelect";

import api from "../../../api/api";

import { yupResolver } from "@hookform/resolvers/yup";

const moment = require("moment");

const positiveInteger = Yup.number()
  .integer("Only integers are accepted!")
  .typeError("Only integers are accepted!")
  .positive("You need to enter a positive integer!")
  .nullable()
  .transform((value, originalValue) => (originalValue.trim() === "" ? null : value));

const validationSchema = Yup.object().shape({
  course: Yup.string().required("This field is required!"),
  type: Yup.string().required("This field is required!"),
  timeStart: Yup.date().required("This field is required!"),
  timeEnd: Yup.date().required("This field is required!")
});

const EditLectureForm = () => {
  const selectedLecture = useSelector((state) => state.lectureEdit);

  const dispatch = useDispatch();

  const [SnackbarData, setSnackBarData] = useState({
    isOpen: false,
    response: null,
  });
  const handleSnackBarClose = (event, reason) => setSnackBarData({ ...SnackbarData, isOpen: false });
  const classes = useStyles();
  const { register, handleSubmit, errors, reset, control } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: selectedLecture
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
    const lecture = { id: selectedLecture.id, 
                      type: data.type, 
                      timeStart: moment(data.timeStart).format("yyy-MM-DDTHH:mm:ss.SSS"),
                      timeEnd: moment(data.timeEnd).format("yyy-MM-DDTHH:mm:ss.SSS")
                    } 
    api
      .post(`/lecture/update/${lecture.id}`, JSON.stringify(lecture), {
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
          //value={selectedLecture.courseId}
          onChange={({ target }) => dispatch(lectureEdit({...selectedLecture, courseId: target.value}))}
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
          value={selectedLecture.type}
          onChange={({ target }) => dispatch(lectureEdit({...selectedLecture, type: target.value}))}
        >
          <MenuItem value={"Lecture"}>Lecture</MenuItem>
          <MenuItem value={"Seminar"}>Seminar</MenuItem>
          <MenuItem value={"Lab"}>Lab</MenuItem>
        </ReactHookFormSelect>

        <label htmlFor="timeStart" className={classes.label}>Time start</label>
        <input 
          name="timeStart" 
          type="datetime-local" 
          ref={register} 
          value={moment(selectedLecture.timeStart).format("yyy-MM-DDTHH:mm")}
          onChange={({ target }) => dispatch(lectureEdit({...selectedLecture, timeStart: target.value}))}
          className={classes.datetime}/>

        <label htmlFor="timeEnd" className={classes.label}>Time end</label>
        <input 
          name="timeEnd" 
          type="datetime-local" 
          ref={register} 
          value={moment(selectedLecture.timeEnd).format("yyy-MM-DDTHH:mm")}
          onChange={({ target }) => dispatch(lectureEdit({...selectedLecture, timeEnd: target.value}))}
          className={classes.datetime}/>

        <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
          Update lecture
        </Button>
      </form>
      <Snackbar open={SnackbarData.isOpen} autoHideDuration={4000} onClose={handleSnackBarClose}>
        {SnackbarData.response != null && (
          <Alert onClose={handleSnackBarClose} severity={SnackbarData.response == false ? "error" : "success"}>
            {SnackbarData.response == false ? "Unable to update lecture! Please check your data!" : "Course successfully updated!"}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default EditLectureForm;

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
}));
