import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import isEmail from "validator/lib/isEmail.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: isEmail,
      message: "Please provide a valid email"
    },
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "lastname"
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "my city"
  }
})

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified("password"));
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

export default mongoose.model("User", UserSchema)