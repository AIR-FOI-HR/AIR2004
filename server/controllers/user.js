const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user");
const Course = require("../models/course");
const PasswordResetToken = require("../models/passwordResetToken");
const moment = require("moment");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.login = async (req, res) => {
  const { email, password, deviceUID } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password!" });

    // Check if passwords match
    const match = await bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid email or password!" });

    // If it's student's first sign in, save his deviceUID
    // Otherwise, check student's deviceUID
    if (user.userType === "student") {
      if (!user.deviceUID) {
        user.deviceUID = deviceUID;
        await user.save();
      }

      if (user.deviceUID !== deviceUID) {
        return res.status(401).json({
          success: false,
          message: "You have to sign in from your own device! If you think this is an error, please contact your teacher for assistance.",
        });
      }
    }

    const token = jwt.sign(
      {
        email: user.email,
        jmbag: user.jmbag,
        phoneNumber: user.phoneNumber,
        name: user.name,
        surname: user.surname,
      },
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
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.loginTablet = async (req, res) => {
  try {
    let user = req.user;

    // Validate authentication token from QR code
    const attendanceToken = req.body.attendanceToken;
    console.log("USER");
    // Send response to the tablet where the teacher signed in
    global.io
      .of("/tablet")
      .to(attendanceToken)
      .emit("login success", { ...user, token: req.token, attendanceToken });

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

exports.resetCode = async (req, res) => {
  const email = req.body.email;

  try {
    const resetCode = Math.floor(100000 + Math.random() * 900000); // broj od 6 znamenki

    const user = await User.findOne({ email });
    if (!user) {
      throw "You have entered an invalid e-mail address!";
    }

    // Generate a password reset token
    const passwordResetToken = new PasswordResetToken({
      user: user._id,
      code: resetCode.toString(),
    });
    await passwordResetToken.save();

    const msg = {
      to: `${req.body.email}`,
      from: `air2004.2020@gmail.com`,
      replyTo: "air2004.2020@gmail.com",
      subject: "Unittend - Your password reset code",
      text: `Hello, you've recently requested a password reset. Please use this code in the application for verification before changing the password: ${resetCode}\n Enjoy!\nSincerely, Unittend team`,
      html: `<p>Hello, you've recently requested a password reset. Please use this code in the application for verification before changing the password: ${resetCode}\n Enjoy!\nSincerely, Unittend team</p>`,
    };
    await sgMail.send(msg);
    res.status(200).json({ success: true, data: resetCode });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { resetCode } = req.body;

  try {
    const passwordResetToken = await PasswordResetToken.findOne({
      code: resetCode,
    });

    if (!passwordResetToken) throw "Reset code is invalid or has expired!";

    res.status(200).json({ success: true, verified: true });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.resetPassword = async (req, res) => {
  const { password, resetCode } = req.body;
  try {
    const passwordResetToken = await PasswordResetToken.findOne({
      code: resetCode,
    });

    const user = await User.findOne({ _id: passwordResetToken.user });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    await passwordResetToken.deleteOne();

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
    let user = req.user;
    user = await User.findOne({ email: user.email }).populate("enrolledCourses").populate("assignedCourses");

    const data = user.toJSON();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error });
  }
};

exports.verify = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid or missing token!" });
  }
};

exports.enroll = async (req, res) => {
  try {
    let student = req.user;

    student = await User.findOne({ jmbag: student.jmbag });
    const course = await Course.findOne({ passcode: req.body.passcode });

    let checkIfEnrolled = student.enrolledCourses.includes(course._id);

    if (checkIfEnrolled) {
      return res.status(400).json({ success: false, message: "Course already enrolled." });
    }

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
    let teacher = req.user;

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
