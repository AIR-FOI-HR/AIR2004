import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import { studentEdit } from "../../../store/actions/userActions";

const columns = ["Name", "Surname", "Email", "JMBAG", "Phone number"];

let ids = [];

const StudentsDataTable = ({ students }) => {
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
     const selectedStudent = {
       id: ids[rowMeta.rowIndex],
       name: rowData[0],
       surname: rowData[1],
       email: rowData[2],
       jmbag: rowData[3],
       phoneNumber: rowData[4],
    };
    addBackground(rowMeta.rowIndex)
    setIndex(rowMeta.rowIndex);
    dispatch(studentEdit(selectedStudent));
  };

  const options = {
    selectableRows: false,
    onRowClick: handleRowClick
  };

  students.map((student) => {
    ids.push(student.id);

    let _student = [
      student.name,
      student.surname,
      student.email,
      student.jmbag,
      student.phoneNumber
    ];

    data.push(_student);
  });

  return (
    <>
      <MUIDataTable
        title={"All students"}
        data={data}
        columns={columns}
        options={options}
      />
    </>
  );
};

export default StudentsDataTable;
