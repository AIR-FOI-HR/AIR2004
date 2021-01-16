import React, { useEffect, useState } from "react";
import EditCourseForm from "../CoursesView/components/EditCourseForm";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { useStyles } from "../TeachersView/styles";

const CoursesViewEdit = () => {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid container className={classes.container}>
        <Grid item>
          <Paper
            className={`${fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
          <Typography>Update course:</Typography>
            <EditCourseForm />
          </Paper>
        </Grid>
      </Grid>
    )
}

export default CoursesViewEdit


