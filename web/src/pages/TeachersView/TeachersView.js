import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "./styles";
import clsx from "clsx";
import { Button } from "@material-ui/core";
import TeachersDataTable from "./components/TeachersDataTable";
import api from "../../api/api";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const TeachersView = () => {
  const classes = useStyles();
  const history = useHistory();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [allTeachers, setAllTeachers] = useState();
  useEffect(() => {
    api.get("/user/teacher/").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllTeachers(response.data.data);
    });
  }, []);
  
  const add = () => {
    history.push('/teachers/add');
  };

  const edit = () => {
    history.push('/teachers/edit');
  };

  const selectedTeacher = useSelector(state => state.teacherEdit);

  const deleteTeacher = (selectedTeacher) => {
    if (selectedTeacher !== null) {
      console.log('delete teacher: ', selectedTeacher);
    api
      .delete(`/user/${selectedTeacher.id}`, {
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
          onClick={() => deleteTeacher(selectedTeacher)}
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
            {allTeachers && <TeachersDataTable teachers={allTeachers} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default TeachersView;
