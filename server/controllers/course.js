const Course = require("../models/course");
const User = require("../models/user");

exports.add = async (req, res) => {
  const { name, passcode, allowedAbsences, teacherId } = req.body;

  let teacher = await User.findOne({ _id: teacherId });
  try {
    let newCourse = new Course({
      name,
      passcode,
      allowedAbsences,
      assignedTeachers: [teacher._id],
    });

    await newCourse.save();
    teacher.assignedCourses = teacher.assignedCourses.concat(newCourse._id);
    await teacher.save();
    console.log("NEW COURSE", newCourse.toJSON());
    res.status(200).json({ success: true, data: newCourse.toJSON() });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.update = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    Object.assign(course, req.body);
    course.save();
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getAll = async (req, res) => {
  try {
    const allCourses = await Course.find();
    const data = allCourses.map((course) => course.toJSON());
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("enrolledStudents");
    const data = course.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
exports.delete = async (req, res) => {
  try {
    const course = await (await Course.findById(req.params.id)).deleteOne();
    const data = course.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};
