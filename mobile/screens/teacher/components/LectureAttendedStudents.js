import React, { useEffect } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import api from "../../../utils/api";
import { useSelector, useDispatch } from "react-redux";

import { setStudentsForLecture } from "../../../store/actions/teacher";
import Loading from "../../common/components/Loading";
import StudentItem from "./StudentItem";

const LectureAttendedStudents = ({ route }) => {
  const lecture = route.params.lecture;
  const dispatch = useDispatch();
  const studentsForLecture = useSelector((state) => state.teacherState.studentsForLecture);
  useEffect(() => {
    api
      .post("/lecture/studentsForLecture", { lectureId: lecture.id })
      .then(({ data }) => dispatch(setStudentsForLecture(data.data)))
      .catch((error) => console.log(error));
  }, []);
  return (
    <>
      {studentsForLecture == null ? (
        <Loading />
      ) : (
        <BottomSheetFlatList
          keyExtractor={(student) => student.id}
          data={studentsForLecture}
          renderItem={({ item }) => <StudentItem student={item} />}
        />
      )}
    </>
  );
};

export default LectureAttendedStudents;
