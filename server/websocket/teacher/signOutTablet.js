const Attendance = require("../../models/attendance");
const Lecture = require("../../models/lecture");

const signOutTable = async ({ attendanceToken, lecture }) => {
  // Notify tablet the teacher has signed off or has stopped tracking attendance
  global.io.of("/tablet").to(attendanceToken).emit("sign out tablet");

  // Delete generated attendance document that hasn't been scanned yet
  await Attendance.deleteOne({ lecture, user: null });

  // Mark lecture as finished
  await Lecture.findByIdAndUpdate(lecture, { $set: { timeEnd: Date.now() } });
};

module.exports = signOutTable;
