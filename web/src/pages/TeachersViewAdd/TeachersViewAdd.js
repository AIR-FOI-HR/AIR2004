import React, { useEffect, useState } from "react";
import NewTeacherForm from "../TeachersView/components/NewTeacherForm";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { useStyles } from "../TeachersView/styles";

const TeachersViewAdd = () => {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid container className={classes.container}>
        <Grid item>
          <Paper
            className={`${fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
          <Typography>Add new teacher:</Typography>
            <NewTeacherForm />
          </Paper>
        </Grid>
      </Grid>
    )
}

export default TeachersViewAdd


