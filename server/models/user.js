const mongoose = require("mongoose");
const Email = require("mongoose-type-email");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: Email,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  jmbag: {
    type: String,
    required: false,
    validate: /^[0-9]{10}$/,
  },
  deviceUID: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: /^([0-9]{10,15})$/,
  },
  userType: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  assignedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  code: {
    type: String,
    required: false,
  },
  created_timestamp: {
    type: String,
    required: false,
  },
  expires_timestamp: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: false,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = mongoose.model("User", userSchema);
