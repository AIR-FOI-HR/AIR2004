import { makeStyles } from "@material-ui/core/styles";
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
    margin: "5% 25%"
  },
}));

export { useStyles };
