import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import AttendanceDataTable from "./components/AttendanceDataTable";
import api from "../../api/api";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom"
import { Button } from "@material-ui/core";

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
  const redirect = () => {
    history.push('/attendances/add');
  };
  return (
    <>
      <Grid container className={classes.container}>
      <Button
          type="add"
          variant="contained"
          color="primary"
          className={classes.add}
          onClick={redirect}
        >
          New attendance
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
