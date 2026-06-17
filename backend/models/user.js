const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  role: {
    type: String,
    enum: ["user", "host", "admin"],
    default: "user",
  },
  avatar: {
    type: String,
    default: ""
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  language: {
    type: String,
    default: "English (US)"
  },
  currency: {
    type: String,
    default: "INR - ₹"
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
