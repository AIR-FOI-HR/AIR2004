import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import Loading from "../../common/components/Loading";

import LectureItem from "./LectureItem";

import BottomSheetBackground from "./BottomSheetBackground";

const BottomSheetCustom = ({ lectures }) => {
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["1%", "50%", "80%"], []);

  // callbacks

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} onChange={handleSheetChange} backgroundComponent={BottomSheetBackground}>
      <Text style={{ fontWeight: "bold", fontSize: 19, paddingLeft: 15 }}>Recent lectures</Text>
      {lectures == null ? (
        <Loading />
      ) : (
        <BottomSheetFlatList
          keyExtractor={(lecture) => lecture.id}
          data={lectures}
          renderItem={({ item }) => <LectureItem lecture={item} />}
        />
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
  },
  pageTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default BottomSheetCustom;
