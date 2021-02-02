import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import LecturesDataTable from "./components/LecturesDataTable";
import api from "../../api/api";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom"
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";

const LecturesView = () => {
  const classes = useStyles();
  const history = useHistory();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [allLectures, setAllLectures] = useState();
  useEffect(() => {
    api.get("/lecture").then((response) => {
      console.log("RESPONSE", response.data.data);
      setAllLectures(response.data.data);
    });
  }, []);

  const add = () => {
    history.push('/lectures/add');
  };

  const edit = () => {
    history.push('/lectures/edit');
  };

  const selectedLecture = useSelector(state => state.lectureEdit);

  const deleteLecture = (selectedLecture) => {
    if (selectedLecture !== null) {
      console.log('delete lecture: ', selectedLecture);
    api
      .delete(`/lecture/${selectedLecture.id}`, {
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
          onClick={() => deleteLecture(selectedLecture)}
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
            {allLectures && <LecturesDataTable lectures={allLectures} />}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default LecturesView;
