import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import AttendanceDataTable from "./components/AttendanceDataTable";
import api from "../../api/api";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom"
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";

const AttendanceView = () => {
  const classes = useStyles();
  const history = useHistory();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [allAttendances, setAllAttendances] = useState();
  useEffect(() => {
    api.get("/attendance").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllAttendances(response.data.data);
    });
  }, []);

  const selectedAttendance = useSelector(state => state.attendanceEdit);

  const deleteAttendance = (selectedAttendance) => {
    if (selectedAttendance !== null) {
      console.log('delete attendance: ', selectedAttendance);
    api
      .delete(`/attendance/${selectedAttendance.id}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("RESPONSE", response);
        //setSnackBarData({ isOpen: true, response: response.data.success });
        history.go(0);
      })
      .catch((error) => {
        //setSnackBarData({ isOpen: true, response: false });
      });
    }
  } 

  return (
    <>
      <Grid container className={classes.container}>
        <Button
          type="delete"
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={() => deleteAttendance(selectedAttendance)}
        >
          Delete
        </Button>
        <Grid item>
          <Paper
            className={`${fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
            {allAttendances && <AttendanceDataTable attendances={allAttendances} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AttendanceView;
