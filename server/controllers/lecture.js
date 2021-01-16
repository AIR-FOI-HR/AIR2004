const Course = require("../models/course");
const Lecture = require("../models/lecture");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getDayName = (date, locale) => {
  return date.toLocaleDateString(locale, { weekday: "long" }).toUpperCase();
};

exports.add = async (req, res) => {
  try {
    await new Lecture({
      ...req.body,
    }).save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const allLectures = await Lecture.find().populate("course");
    const data = allLectures.map((lecture) => lecture.toJSON());
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getLecturesForTeacher = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  let teacher = jwt.verify(token, process.env.JWT_SECRET);
  teacher = await User.findOne({ email: teacher.email });
  const teacherId = teacher._id;
  // find courses for teacher
  const coursesForTeacher = await Course.find({ assignedTeachers: teacherId });

  try {
    const lecturesForTeacher = await Lecture.find({ course: coursesForTeacher }).populate("course");
    const data = lecturesForTeacher.map((lecture) => {
      return {
        id: lecture._id,
        timeStart: moment(lecture.timeStart).format("hh:mm"),
        timeEnd: moment(lecture.timeEnd).format("hh:mm"),
        type: lecture.type,
        course: lecture.course.name,
        enrolledStudents: lecture.course.enrolledStudents,
        date: moment(lecture.timeStart).format("DD"),
        month: moment(lecture.timeStart).format("MMMM").substr(0, 3),
        day: getDayName(lecture.timeStart, "en-US"),
        courseName: lecture.course.name,
        lectureType: lecture.type,
      };
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.update = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    Object.assign(lecture, req.body);
    lecture.save();
    res.status(200).json({ success: true, lecture });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.delete = async (req, res) => {
  try {
    const lecture = await (await Lecture.findById(req.params.id)).deleteOne();
    const data = lecture.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error }); 
  }
};
