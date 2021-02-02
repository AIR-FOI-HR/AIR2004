import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import { attendanceEdit } from "../../../store/actions/userActions";
import api from "../../../api/api";
const moment = require("moment");

const columns = ["Course", "Lecture", "Student", "Modified at"];

let ids = [];

const AttendanceDataTable = ({ attendances }) => {
  let data = [];

  const dispatch = useDispatch();

  const [index, setIndex] = useState();

  const removeBackground = (index) => {
    let row = document.getElementById(`MUIDataTableBodyRow-${index}`);
    row.setAttribute('style', 'background: white');
  };

  const addBackground = (index) => {
    let row = document.getElementById(`MUIDataTableBodyRow-${index}`);
    row.setAttribute('style', 'background: lightgray');
  }

  const handleRowClick = (rowData, rowMeta) => {
    if (index !== undefined) {
      removeBackground(index);
    }
     const selectedAttendance = {
       id: ids[rowMeta.rowIndex],
       course: rowData[0],
       lecture: rowData[1],
       user: rowData[2],
       modifiedAt: rowData[3],
    };
    addBackground(rowMeta.rowIndex)
    setIndex(rowMeta.rowIndex);
    dispatch(attendanceEdit(selectedAttendance));
  };

  const options = {
    selectableRows: false,
    onRowClick: handleRowClick
  };

  const [allLectures, setAllLectures] = useState([]);
  useEffect(() => {
    api.get("/lecture").then((response) => {
      setAllLectures(response.data.data);
    });
  }, []);

  const [allStudents, setAllStudents] = useState([]);
  useEffect(() => {
    api.get("/user/student").then((response) => {
      setAllStudents(response.data.data);
    });
  }, []);

  attendances.map((attendance) => {
    ids.push(attendance._id);

    console.log('aatendance: ', attendance);

    let modifiedAtFormatted = moment(attendance.modifiedAt).format("yyyy-MM-DD HH:mm");

    let course = '';
    let lectureType = '';
    let student = '';
  
    for (let i = 0; i < allLectures.length; i++) {
      if (attendance.lecture === allLectures[i].id) {
        course = allLectures[i].course.name;       
        lectureType = allLectures[i].type
      }
    }

    for (let j = 0; j < allStudents.length; j++) {
      if (attendance.user === allStudents[j].id) {
        student = allStudents[j].name + ' ' + allStudents[j].surname;
      }
    } 

    let _attendance = [
      course,
      lectureType,
      student,
      modifiedAtFormatted
    ];

    data.push(_attendance);
  });

  return (
    <>
      <MUIDataTable title={"All attendances"} data={data} columns={columns} options={options} />
    </>
  );
};

export default AttendanceDataTable;
