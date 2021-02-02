const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordGenerator = require("generate-password");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
const Course = require("../models/course");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, message: "Email or password not valid!" });

  // Check if passwords match
  const match = await bcrypt.compareSync(password, user.password);
  if (!match) return res.status(401).json({ success: false, message: "Email or password not valid!" });

  const token = jwt.sign(
    { email: user.email, jmbag: user.jmbag, phoneNumber: user.phoneNumber, name: user.name, surname: user.surname },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    success: true,
    user: {
      userId: user.id,
      token,
      email: user.email,
      jmbag: user.jmbag,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      name: user.name,
      surname: user.surname,
    },
  });
};

exports.loginTablet = async (req, res) => {
  try {
    // Validate JWT
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Validate authentication token from QR code
    const attendanceToken = req.body.attendanceToken;

    // Send response to the tablet where the teacher signed in
    global.io
      .of("/tablet")
      .to(attendanceToken)
      .emit("login success", { ...user, token, attendanceToken });

    // Send response to the mobile app
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error });
  }
};

exports.register = async (req, res) => {
  const { role } = req.params;

  if (!["student", "teacher"].includes(role)) return res.status(400).json({ success: false, error: "Valid roles are student, teacher" });

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await new User({
      ...req.body,
      password: hashedPassword,
      userType: role,
    }).save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const newPassword = passwordGenerator.generate({
      length: 10,
      numbers: true,
    });
    if (!user) throw "User not found";

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    const msg = {
      to: `${req.body.email}`,
      from: `air2004.2020@gmail.com`,
      replyTo: "air2004.2020@gmail.com",
      subject: "Unittend - Your new password",
      text: `Hello, we've successfully changed your password, and it's ${newPassword}\nEnjoy!\nSincerely, Unittend team`,
      html: `<p>Hello, we've successfully changed your password, and it's ${newPassword}\nEnjoy!\nSincerely, Unittend team</p>`,
    };
    await sgMail.send(msg);
    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getAllUsers = async (req, res) => {
  const { role } = req.params;

  if (!["student", "teacher", "admin"].includes(role))
    return res.status(400).json({
      success: false,
      error: "Valid roles are student, teacher, admin",
    });

  try {
    const allUsers = await User.find({ userType: role });
    const data = allUsers.map((user) => user.toJSON());
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let user = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findOne({ email: user.email }).populate("enrolledCourses").populate("assignedCourses");
    const data = user.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.verify = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid or missing token!" });
  }
};

exports.enroll = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let student = jwt.verify(token, process.env.JWT_SECRET);

    student = await User.findOne({ jmbag: student.jmbag });
    const course = await Course.findOne({ passcode: req.body.passcode });

    student.enrolledCourses = student.enrolledCourses.concat(course._id);
    course.enrolledStudents = course.enrolledStudents.concat(student._id);
    const data = { student, course };

    await student.save();
    await course.save();

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.assignCourse = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let teacher = jwt.verify(token, process.env.JWT_SECRET);

    teacher = await User.findOne({ email: teacher.email });

    const course = await Course.findOne({ passcode: req.body.passcode });

    teacher.assignedCourses = teacher.assignedCourses.concat(course._id);
    course.assignedTeachers = course.assignedTeachers.concat(teacher._id);
    const data = { teacher, course };

    await teacher.save();
    await course.save();

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    Object.assign(user, req.body);
    user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await (await User.findById(req.params.id)).deleteOne();
    const data = user.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error }); 
  }
};

exports.resetUID = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    student.deviceUID = 'null';
    student.save(); 
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(400).json({ success: false, error});
  }
};
