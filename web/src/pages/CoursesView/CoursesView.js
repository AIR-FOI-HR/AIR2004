import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import clsx from "clsx";
import CoursesDataTable from "./components/CoursesDataTable";
import api from "../../api/api";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const CoursesView = () => {
  const classes = useStyles();
  const history = useHistory();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [allCourses, setAllCourses] = useState();
  useEffect(() => {
    api.get("/course").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllCourses(response.data.data);
    });
  }, []);

  const add = () => {
    history.push("/courses/add");
  };

  const edit = () => {
    history.push("/courses/edit");
  };

  const selectedCourse = useSelector((state) => state.courseEdit);

  const deleteCourse = (selectedCourse) => {
    if (selectedCourse !== null) {
      console.log("delete course: ", selectedCourse);
      api
        .delete(`/course/${selectedCourse.id}`, {
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
  };

  return (
    <>
      <Grid container className={classes.container}>
        <Button type="add" variant="contained" color="primary" className={classes.button} onClick={add}>
          New
        </Button>
        <Button type="delete" variant="contained" color="secondary" className={classes.button} onClick={() => deleteCourse(selectedCourse)}>
          Delete
        </Button>
        <Button type="update" variant="contained" color="default" className={classes.button} onClick={edit}>
          Edit
        </Button>
        <Grid item>
          <Paper className={`${fixedHeightPaper} ${classes.Paper}`} elevation={3}>
            {allCourses && <CoursesDataTable courses={allCourses} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default CoursesView;
