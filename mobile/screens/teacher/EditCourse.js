import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, HelperText } from "react-native-paper";
import { FAB } from "react-native-paper";
import { showMessage } from "react-native-flash-message";
import { editCourse } from "../../store/actions/teacher";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../utils/api";

const EditCourseSchema = Yup.object({
  name: Yup.string().required("This field is required!"),
  passcode: Yup.string().length(8, "Passcode must be 8 characters long!").required("This field is required!"),
  allowedAbsences: Yup.number().typeError("This field must be a number!").required("This field is required!"),
});

const EditCourse = ({ route }) => {
  const course = route.params.course;
  const navigation = route.params.navigation;

  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      passcode: "",
      allowedAbsences: "",
    },
    validationSchema: EditCourseSchema,
    onSubmit: (values) => {
      handleEditCourse(values);
    },
  });

  const handleEditCourse = (editedCourse) => {
    api.post(`/course/update/${course.id}`, editedCourse).then((data) => {
      dispatch(editCourse(data.data.course));
      navigation.goBack();
      showMessage({
        message: `Course ${course.name} edited!`,
        description: `You have successfully edited course ${course.name}!`,
        type: "success",
        duration: 2500,
        icon: "success",
      });
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>
          <Text style={styles.firstWord}>Edit</Text> course {course.name}
        </Text>
        <Text style={styles.title}>Course name:</Text>
        <TextInput
          style={styles.textInput}
          placeholder={course.name}
          value={formik.name}
          onBlur={formik.handleBlur("name")}
          onChangeText={formik.handleChange("name")}
        />
        <HelperText type="error" visible={formik.errors.name}>
          {formik.errors.name}
        </HelperText>

        <Text style={styles.title}>Course join passcode:</Text>
        <TextInput
          style={styles.textInput}
          placeholder={course.passcode.toString()}
          value={formik.passcode}
          onBlur={formik.handleBlur("passcode")}
          onChangeText={formik.handleChange("passcode")}
        />
        <HelperText type="error" visible={formik.errors.passcode}>
          {formik.errors.passcode}
        </HelperText>

        <Text style={styles.title}>Number of allowed absences:</Text>
        <TextInput
          style={styles.textInput}
          placeholder={course.allowedAbsences.toString()}
          value={formik.allowedAbsences}
          onBlur={formik.handleBlur("allowedAbsences")}
          onChangeText={formik.handleChange("allowedAbsences")}
        />
        <HelperText type="error" visible={formik.errors.allowedAbsences}>
          {formik.errors.allowedAbsences}
        </HelperText>
      </View>
      <FAB style={styles.fab} small label="Save" icon="content-save" color="black" onPress={formik.handleSubmit} />
    </>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    margin: 25,
  },
  courseIcon: {
    backgroundColor: "white",
    width: 35,
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 5,
  },
  fab: {
    position: "absolute",
    marginBottom: 40,
    marginRight: 20,
    right: 0,
    bottom: 0,
  },
  courseCard: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "normal",
  },
  cardContentWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cardLectureTypes: {
    flexDirection: "row",
  },
  cardActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  firstWord: {
    fontWeight: "bold",
  },
  lectureTypeBadge: {
    borderWidth: 1.5,
    marginRight: 5,
    borderColor: "#9b5cf4",
    backgroundColor: "#f2eafe",
  },
});

export default EditCourse;
