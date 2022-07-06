const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  user_id: {
    type: String,
    maxlength: 30,
  },
  user_password: {
    type: String,
    maxlength: 30,
  },
  user_confirmPassword: {
    type: String,
    maxlength: 30,
  },
  user_name: {
    type: String,
    maxlength: 30,
  },
  user_email: {
    type: String,
    maxlength: 30,
    unique: 1,
    trim: true,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  // salt를 이용해서 비밀번호 암호화한 후 보내줌 (비밀번호와 관련될 때만)
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    // 그 외에는 그냥 내보냄
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
