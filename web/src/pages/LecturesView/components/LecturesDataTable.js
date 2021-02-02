import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import { lectureEdit } from "../../../store/actions/userActions";
const moment = require("moment");

const columns = [ {
                    name: "Course id",
                    options: {
                      display: false,
                    }
                  }, "Course", "Type", "Time start", "Time end"];

let ids = [];

const LecturesDataTable = ({ lectures }) => {
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
     const selectedLecture = {
       id: ids[rowMeta.rowIndex],
       courseId: rowData[0],
       course: rowData[1],
       type: rowData[2],
       timeStart: rowData[3],
       timeEnd: rowData[4],
    };
    addBackground(rowMeta.rowIndex)
    setIndex(rowMeta.rowIndex);
    dispatch(lectureEdit(selectedLecture));
  };

  const options = {
    selectableRows: false,
    onRowClick: handleRowClick
  };

  lectures.map((lecture) => {
    ids.push(lecture.id);

    let timeStartFormatted = moment(lecture.timeStart).format("yyyy-MM-DD HH:mm");
    let timeEndFormatted = moment(lecture.timeEnd).format("yyyy-MM-DD HH:mm");

    let _lecture = [
      lecture.course.id,
      lecture.course.name, 
      lecture.type, 
      timeStartFormatted, 
      timeEndFormatted
    ];

    data.push(_lecture);
  });

  return (
    <>
      <MUIDataTable  title={"All lectures"} data={data} columns={columns} options={options} />
    </>
  );
};

export default LecturesDataTable;
