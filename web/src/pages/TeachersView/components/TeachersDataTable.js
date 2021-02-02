import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import { teacherEdit } from "../../../store/actions/userActions";

const columns = ["Name", "Surname", "Email", "Phone number"];

let ids = [];

const TeachersDataTable = ({ teachers }) => {
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
     const selectedTeacher = {
       id: ids[rowMeta.rowIndex],
       name: rowData[0],
       surname: rowData[1],
       email: rowData[2],
       phoneNumber: rowData[3],
    };
    addBackground(rowMeta.rowIndex)
    setIndex(rowMeta.rowIndex);
    dispatch(teacherEdit(selectedTeacher));
  };

  const options = {
    selectableRows: false,
    onRowClick: handleRowClick
  };

  teachers.map((teacher) => {
    ids.push(teacher.id);

    let _teacher = [
      teacher.name, 
      teacher.surname, 
      teacher.email, 
      teacher.phoneNumber];

    data.push(_teacher);
  });

  return (
    <>
      <MUIDataTable
        title={"All teachers"}
        data={data}
        columns={columns}
        options={options}
      />
    </>
  );
};

export default TeachersDataTable;
