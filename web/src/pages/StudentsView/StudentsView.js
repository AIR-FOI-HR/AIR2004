import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import clsx from "clsx";
import StudentsDataTable from "./components/StudentsDataTable";
import api from "../../api/api";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const StudentsView = () => {
  const classes = useStyles();
  const history = useHistory();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [allStudents, setAllStudents] = useState();
  useEffect(() => {
    api.get("/user/student").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllStudents(response.data.data);
    });
  }, []);

  const add = () => {
    history.push('/students/add');
  };

  const edit = () => {
    history.push('/students/edit');
  };

  const selectedStudent = useSelector(state => state.studentEdit);

  const deleteStudent = (selectedStudent) => {
    if (selectedStudent !== null) {
      console.log('delete student: ', selectedStudent);
    api
      .delete(`/user/${selectedStudent.id}`, {
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
          type="add"
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={add}
        >
          New
        </Button>
        <Button
          type="delete"
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={() => deleteStudent(selectedStudent)}
        >
          Delete
        </Button>
        <Button
          type="update"
          variant="contained"
          color="default"
          className={classes.button}
          onClick={edit}
        >
          Edit
        </Button>
        <Grid item>
          <Paper
            className={`${fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
            {allStudents && <StudentsDataTable students={allStudents} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default StudentsView;
