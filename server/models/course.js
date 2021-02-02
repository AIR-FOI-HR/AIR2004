const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  passcode: {
    type: String,
    required: true,
    unique: true,
    validate: /^[0-9]{8}$/,
  },
  allowedAbsences: {
    type: Number,
    default: 3,
    required: true,
    //validate: /^[0-9]{2}$/,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  assignedTeachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

courseSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Course", courseSchema);
