import React, { useEffect, useState } from "react";
import EditTeacherForm from "../TeachersView/components/EditTeacherForm";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { useStyles } from "../TeachersView/styles";

const TeachersViewEdit = () => {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid container className={classes.container}>
        <Grid item>
          <Paper
            className={`${fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
          <Typography>Update teacher:</Typography>
            <EditTeacherForm />
          </Paper>
        </Grid>
      </Grid>
    )
}

export default TeachersViewEdit;