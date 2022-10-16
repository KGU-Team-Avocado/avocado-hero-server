const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  user_id: {
    type: String,
    maxlength: 30,
    unique: 1,
    default: 'undefined',
  },
  user_password: {
    type: String,
    maxlength: 30,
    default: 'undefined',
  },
  name: {
    type: String,
    maxlength: 30,
    default: 'undefined',
  },
  email: {
    type: String,
    maxlength: 30,
    //unique: 1,
    trim: true, //공백제거
    default: 'undefined',
  },
  type: {
    type: String,
    default: 'undefined',
  },
  phoneNumber: {
    type: String,
    maxlength: 30,
    default: 'undefined',
  },
  age: {
    type: String,
    default: 'undefined',
  },
  nickname: {
    type: String,
    maxlength: 30,
    default: 'undefined',
  },
  imgURL: {
    // 사진
    type: String,
    default: 'undefined',
  },
  // -- 기본 정보 --

  belongs: [String],
  fields: [String],
  links: [String],
  // -- 스펙 관련 --

  introduce: {
    // 소개글
    type: String,
    default: 'undefined',
  },
  keywords: [String],
  personalities: [String], // 성향,
  groups: [String],
  introduceOne: {
    type: String,
    default: 'undefined', 
  }
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
