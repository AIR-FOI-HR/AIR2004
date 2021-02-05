const Attendance = require("../models/attendance");
const User = require("../models/user");
const Lecture = require("../models/lecture");
const moment = require("moment");
const lecture = require("../models/lecture");

function getDayName(date, locale) {
  return date.toLocaleDateString(locale, { weekday: "long" }).toUpperCase();
}

exports.add = async (req, res) => {
  try {
    const attendance = await new Attendance({
      ...req.body,
    }).save();
    const lectureId = req.body.lecture;
    Lecture.findOneAndUpdate({ _id: lectureId }, { $push: { attendingStudents: req.body.user } }, function (err, affected, resp) {});
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.update = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    Object.assign(attendance, req.body);
    attendance.save();
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.delete = async (req, res) => {
  try {
    const attendance = await (await Attendance.findById(req.params.id)).deleteOne();
    const data = attendance.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const allAttendances = await Attendance.find();
    const data = allAttendances.map((attendance) => attendance.toJSON());
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getAllByStudent = async (req, res) => {
  try {
    let user = req.user;

    let student = await User.find({ jmbag: user.jmbag });

    const allAttendances = await Attendance.find({
      user: student[0]._id,
    }).populate({
      path: "lecture",
      populate: {
        path: "course",
      },
    });

    const data = allAttendances.map((attendance) => {
      return {
        id: attendance._id,
        fullDate: attendance.modifiedAt,
        date: moment(attendance.modifiedAt).format("DD"),
        month: moment(attendance.modifiedAt).format("MMMM").substr(0, 3),
        day: getDayName(attendance.modifiedAt, "en-US"),
        courseName: attendance.lecture.course.name,
        lectureType: attendance.lecture.type,
        attendanceTime: moment(attendance.modifiedAt).add(1, "h").format("HH:mm"),
        present: true,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getMissed = async (req, res) => {
  try {
    let user = req.user;

    let student = await User.find({ jmbag: user.jmbag });

    const missedAttendance = await Lecture.find().populate({
      path: "course",
    });

    const missed = missedAttendance
      .map((item) => {
        if (item.course.enrolledStudents.includes(student[0]._id) && !item.attendingStudents.includes(student[0]._id)) return item;
      })
      .filter((item) => item !== undefined && item.course.name === "Matematics 2");

    const data = missed.map((attendance) => {
      return {
        id: attendance._id,
        date: moment(attendance.timeStart).format("DD"),
        month: moment(attendance.timeStart).format("MMMM").substr(0, 3),
        day: getDayName(attendance.timeStart, "en-US"),
        courseName: attendance.course.name,
        lectureType: attendance.type,
        present: false,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.markAttendance = async (req, res) => {
  const code = req.body.code;
  const user = req.body.user;

  try {
    const foundAttendance = await Attendance.findOne({ qrCode: code });
    const lectureInProgress = global.lecturesInProgress.find((x) => x.lecture == foundAttendance.lecture);

    // Check if that user has already marked attendance on that lecture
    const alreadyMarked = await Attendance.findOne({ lecture: lectureInProgress.lecture, user });
    if (alreadyMarked) return res.status(400).json({ success: false });

    // Get the lecture
    const lectureToRecord = await Lecture.findById(lectureInProgress.lecture);

    // Check if student has enrolled that course
    const courseId = lectureToRecord.course;
    const student = await User.findById(user);
    if (!student.enrolledCourses.includes(courseId)) return res.status(400).json({ success: false });

    // Update attendance document with the code
    const attendance = await Attendance.findOneAndUpdate(
      { qrCode: code, user: null },
      { $set: { user, modifiedAt: Date.now() } },
      { new: true }
    );

    // Get attendance token for that lecture
    const attendanceToken = lectureInProgress?.attendanceToken;

    if (!attendanceToken) return res.status(400).json({ success: false });

    // Add user into array of students that submit attendance for this lecture
    lectureToRecord.attendingStudents.push(user);
    await lectureToRecord.save();

    // If the update didn't succeed (the qrCode is either invalid or it has been already used) return 400
    if (!attendance) return res.status(400).json({ success: false });

    // Generate new attendance (qrCode) entry
    const newAttendance = await new Attendance({ lecture: attendance.lecture }).save();

    // Send the new attendance qrCode to the tablet
    global.io.of("/tablet").to(attendanceToken).emit("attendance code", { code: newAttendance.qrCode, lecture: attendance.lecture });

    // Send the attendance to the mobile app along with the user data who marked the attendance
    const markedAttendance = await Attendance.findById(attendance.id).populate("user", "name surname");
    global.io.of("/teacher").to(attendanceToken).emit("new attendance", markedAttendance);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).json({ success: false, error });
  }
};
