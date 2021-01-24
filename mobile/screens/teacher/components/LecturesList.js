import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import api from "../../../utils/api";
import LectureItem from "./LectureItem";
import { setLectures } from "../../../store/actions/teacher";
const LecturesList = ({ navigation }) => {
  const user = useSelector((state) => state.userState);
  const lectures = useSelector((state) => state.teacherState.lectures);
  const dispatch = useDispatch();
  useEffect(() => {
    api
      .get("/lecture/lecturesForTeacher", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => dispatch(setLectures(data.data)))
      .catch((error) => console.log(error));
  }, []);
  return (
    <BottomSheetFlatList
      keyExtractor={(lecture) => lecture.id}
      data={lectures}
      renderItem={({ item }) => <LectureItem lecture={item} navigation={navigation} />}
    />
  );
};

export default LecturesList;
