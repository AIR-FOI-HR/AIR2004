import NewStudentForm from "../StudentsView/components/NewStudentForm";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React from "react";
import clsx from "clsx";
import { useStyles } from "../StudentsView/styles";

const StudentViewAdd = () => {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid container className={classes.container}>
        <Grid item>
          <Paper
            className={`${fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
          <Typography>Add new student:</Typography>
            <NewStudentForm />
          </Paper>
        </Grid>
      </Grid>
    )
}

export default StudentViewAdd


