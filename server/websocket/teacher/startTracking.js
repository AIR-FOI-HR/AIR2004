const Attendance = require("../../models/attendance");

const startTracking = async (socket, data) => {
  const attendanceToken = Array.from(socket.rooms)[1];

  const lecture = data.lecture;
  const attendance = await new Attendance({ lecture }).save();

  // Mark that lecture as in progress
  global.lecturesInProgress.push({
    lecture,
    attendanceToken,
  });

  console.log("LECTURES IN PROGRESS", global.lecturesInProgress);

  global.io.of("/tablet").to(attendanceToken).emit("attendance code", { code: attendance.qrCode, lecture: lecture, attendanceToken });
};

module.exports = startTracking;
