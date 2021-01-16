const mongoose = require("mongoose");
const cryptoRandomString = require("crypto-random-string");

const attendanceSchema = mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  qrCode: {
    type: String,
    required: false,
    unique: true,
    default: () => cryptoRandomString({ length: 15 }),
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

attendanceSchema.index({ lecture: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
