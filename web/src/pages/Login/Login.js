import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from 'react-hook-form';
import MuiAlert from '@material-ui/lab/Alert';
import * as Yup from 'yup';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import api from '../../api/api';
import { yupResolver } from '@hookform/resolvers/yup';

const initialValues = {
    email: '',
    password: '',
};

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("You need to enter a valid email!")
        .required("This field is required!"),
    password: Yup.string()
        .required("This field is required!"),
});

const Alert = props => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const LoginForm = () => {

    const [SnackbarData, setSnackBarData] = useState({
        isOpen: false,
        response: null,
    });

    const classes = useStyles();
    
    const handleSnackBarClose = (event, reason) => {
        setSnackBarData({ ...SnackbarData, isOpen: false });
    }

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: initialValues,
    });

    const onSubmit = (data) => {
        api
            .post('/user/login', JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' },
            })
            .then(({ data }) => {
                console.log('RESPONSE: ', data);
                localStorage.setItem('userToken', data.user.token);
                setSnackBarData({ isOpen: true, response: data.success });
                reset();
            })
            .catch(error => {
                setSnackBarData({ isOpen: true, response: false });
                reset();
            });
    }

    return (
      <Grid container className={classes.container}>
        <Grid item>
          <Paper
            className={`${classes.fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form} >
                <TextField 
                    name="email"
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    required
                    inputRef={register}
                    fullWidth
                    id="email"
                    autoComplete="email"
                />
                {errors.email?.message && (
                    <Typography>{errors.email.message}</Typography>
                )}

                <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    required
                    type="password"
                    inputRef={register}
                    fullWidth
                    id="password"
                    autoComplete="password"
                />
                {errors.password?.message && (
                    <Typography>{errors.password.message}</Typography>
                )}

                <Button 
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Login
                </Button>
            </form>
            <Snackbar
                open={SnackbarData.isOpen}
                autoHideDuration={4000}
                onClose={handleSnackBarClose}
            >
                {SnackbarData.response != null && (
                <Alert
                    onClose={handleSnackBarClose}
                    severity={SnackbarData.response == false ? "error" : "success"}
                >
                    {SnackbarData.response == false
                    ? "Unable to login! Please check your data!"
                    : "Successfully login!"}
                </Alert>
                )}
            </Snackbar>
          </Paper>
          <Paper
            className={`${classes.fixedHeightPaper} ${classes.Paper}`}
            elevation={3}
          >
          </Paper>
        </Grid>
      </Grid>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    fixedHeightPaper: {
        height: 240,
    },
    Paper: {
        height: "fit-content",
        margin: "2%",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        width: "100%",
    },
    container: {
        marginLeft: "35%",
        marginTop: "10%",
    },
    form: {
        margin: "5%"
    }
}));

export default LoginForm;