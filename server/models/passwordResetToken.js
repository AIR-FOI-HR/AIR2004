const mongoose = require("mongoose");

const passwordResetToken = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "10m" },
  },
});

module.exports = mongoose.model("PasswordResetToken", passwordResetToken);
