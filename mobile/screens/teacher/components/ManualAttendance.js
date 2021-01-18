import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import api from '../../../utils/api';

const ManualAttendance = () => {

    const user = useSelector(state => state);

    const enrolledStudentsIds = user.courseSelectedOnTablet.course.enrolledStudents;
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({});

    useEffect(() => {
        api
            .get("/user/student")
            .then((response) => {
                const enrolledStudents = response.data.data.filter(student => enrolledStudentsIds.includes(student.id));
                setEnrolledStudents(enrolledStudents);
          
            });
    }, []);

    const handleSaveAttendance = () => {

        const body = {
                lecture: user.courseSelectedOnTablet.lecture.id,
                user: selectedStudent,
        };        

        api
        .post("/attendance/add", body,
        )
        .then(({ data }) => {
          console.log("MANUAL ATTENDANCE ADDED");
        })
        .catch((error) => console.log(error));
    }
        
    return (
        <View style={styles.container}>
            <Text style={styles.radioButtonTitle}>
            Course name:
            </Text>
           
            <Text>{user.courseSelectedOnTablet.course.name}</Text>
            <Text style={styles.studentTitle}>
            Select lecture types:
            </Text>
            <Text>{user.courseSelectedOnTablet.lecture.type}</Text>
           
            <Text style={styles.studentTitle}>
            Student:
            </Text>
            <Picker
                selectedValue={selectedStudent}
                style={{height: 50, width: "100%"}}
                onValueChange={(itemValue, itemIndex) => setSelectedStudent(itemValue)}
            >
                {enrolledStudents.map(({ id, name, surname, jmbag }) => <Picker.Item key={id} label={`${name} ${surname} (${jmbag})`} value={id} />)}
            </Picker>
            <Button
                style={{ marginTop: 50 }}
                mode="contained"
                icon={() => <MaterialCommunityIcons name="plus" size={35} color="#fff" />}
                onPress={handleSaveAttendance}
                >
                Save attendance
            </Button>
        </View>
        
    );
    }

    const styles = StyleSheet.create({
        radioButtonTitle:{
            fontWeight: "bold",
            fontSize: 20,
        },
        radioButtonGroup:{
            display:"flex",
            flexDirection:"row",
            alignItems:"center",
        },
        container:{
            width:"100%",
            padding: 25,
            flexDirection: "column",
            justifyContent:"flex-start",
        },
        studentTitle:{
            paddingTop: 10,
            fontWeight: "bold",
            fontSize: 20,
        }

      });
export default ManualAttendance;