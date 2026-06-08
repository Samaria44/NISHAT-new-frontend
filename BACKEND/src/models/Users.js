const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    last_login: {
      type: Date,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    is_updated: {
      type: Boolean,
      default: false,
    },
    deleted_at: Date,
    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // provides createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);

module.exports = User;
