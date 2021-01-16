import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import { courseEdit } from "../../../store/actions/userActions";

const columns = ["Name", "Passcode", "Allowed absences", "Enrolled students"];

let ids = [];

const CoursesDataTable = ({ courses }) => {
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
     const selectedCourse = {
       id: ids[rowMeta.rowIndex],
       name: rowData[0],
       passcode: rowData[1],
       allowedAbsences: rowData[2]
    };
    addBackground(rowMeta.rowIndex)
    setIndex(rowMeta.rowIndex);
    dispatch(courseEdit(selectedCourse));
  };

  const options = {
    selectableRows: false,
    onRowClick: handleRowClick
  };
  
  courses.map((course) => {
    ids.push(course.id);
    let _course = [course.name, course.passcode, course.allowedAbsences, course.enrolledStudents ? course.enrolledStudents.length : 0];

    data.push(_course);
  });

  return (
    <>
      <MUIDataTable title={"All courses"} data={data} columns={columns} options={options} />
    </>
  );
};

export default CoursesDataTable;
