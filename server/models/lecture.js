const mongoose = require("mongoose");

const lectureSchema = mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  type: {
    type: String,
    enum: ["Lecture", "Seminar", "Lab"],
    required: true,
  },
  timeStart: {
    type: Date,
    default: Date.now,
    required: false,
  },
  timeEnd: {
    type: Date,
    required: false,
  },
  attendingStudents: [ { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

lectureSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Lecture", lectureSchema);
