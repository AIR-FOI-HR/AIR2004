const bcrypt = require("bcrypt");
const Course = require("../models/course");

exports.add = async (req, res) => {
  console.log('req:', req.body);
  try {
    await new Course({
      ...req.body,
    }).save();
    res.status(200).json({ success: true });
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
}

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
