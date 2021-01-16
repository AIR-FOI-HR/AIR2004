import React from "react";
import MUIDataTable from "mui-datatables";

const columns = ["Lecture", "User", "Modified at"];

const AttendanceDataTable = ({ attendances }) => {
  let data = [];

  attendances.map((attendance) => {
    let _attendace = [attendance.lecture, attendance.user, attendance.modifiedAt];
    data.push(_attendace);
  });

  return (
    <>
      <MUIDataTable title={"All attendances"} data={data} columns={columns} />
    </>
  );
};

export default AttendanceDataTable;
