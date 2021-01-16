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
    console.log(data);
    api
      .post("/lecture/add", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        setSnackBarData({ isOpen: true, response: response.data.success });
        reset();
      })
      .catch((error) => {
        setSnackBarData({ isOpen: true, response: false });
        reset();
      });
      history.push('/lectures');
  };
  console.log("SNACKBAR response", SnackbarData.response);

  const [dateFrom, setdateFrom] = React.useState("");
  const [dateTo, setdateTo] = React.useState("");

  const handleChangeDateFrom = (event) => {
    setdateFrom(event.target.value);
    console.log("from: ", dateFrom);
  };

  const handleChangeDateTo = (event) => {
    setdateTo(event.target.value);
    console.log("to: ", dateTo);
  };

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

        <div className={classes.dateTime}>
          <TextField
            variant="outlined"
            margin="normal"
            label="From"
            type="date"
            defaultValue="2020-01-01"
            inputRef={register}
            id="dateFrom"
            onChange={handleChangeDateFrom}
          />
          {errors.timeStart?.message && (
            <Typography>{errors.timeStart.message}</Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            label="To"
            type="date"
            inputRef={register}
            id="dateTo"
            onChange={handleChangeDateTo}
          />
          {errors.timeEnd?.message && (
            <Typography>{errors.timeEnd.message}</Typography>
          )}
        </div>

        <ReactHookFormSelect
          id="day"
          name="day"
          label="Day of week"
          control={control}
          variant="outlined"
          margin="normal"
          defaultValue="None"
          fullWidth
        >
          <MenuItem value={"Monday"}>Monday</MenuItem>
          <MenuItem value={"Tuesday"}>Tuesday</MenuItem>
          <MenuItem value={"Wednesday"}>Wednesday</MenuItem>
          <MenuItem value={"Thursday"}>Thursday</MenuItem>
          <MenuItem value={"Friday"}>Friday</MenuItem>
        </ReactHookFormSelect>

        <div className={classes.dateTime}>
          <TextField
            variant="outlined"
            margin="normal"
            label="Time start"
            type="time"
            defaultValue="08:00"
            required
            inputRef={register}
            id="timeStart"
            onChange={handleChangeDateFrom}
          />
          {errors.timeStart?.message && (
            <Typography>{errors.timeStart.message}</Typography>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            label="Time end"
            type="time"
            defaultValue="10:00"
            required
            inputRef={register}
            id="timeEnd"
            onChange={handleChangeDateTo}
          />
          {errors.timeEnd?.message && (
            <Typography>{errors.timeEnd.message}</Typography>
          )}
        </div>

        <ReactHookFormSelect
          id="lectureRoom"
          name="lectureRoom"
          label="Lecture room"
          control={control}
          variant="outlined"
          margin="normal"
          defaultValue="None"
          fullWidth
        >
          <MenuItem value={"D1"}>D1</MenuItem>
          <MenuItem value={"D2"}>D2</MenuItem>
          <MenuItem value={"D3"}>D3</MenuItem>
          <MenuItem value={"D15"}>D15</MenuItem>
          <MenuItem value={"D16"}>D16</MenuItem>
        </ReactHookFormSelect>

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
