const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { User } = require("../models/User");

// //application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// //application/json
// app.use(bodyParser.json());

router.post("/register", (req, res) => {
  // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
  console.log(req.body);

  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 비밀번호를 암호화하여
  // 그것들을 데이터베이스에 넣어준다.
  // 회원가입이 성공했다는 응답을 준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
  const account = req.body;
  User.findOne(
    {
      $and: [{ user_id: account.id }, { user_password: account.password }],
    },
    function (error, user) {
      if (error) {
        console.log(error);
        return res.json({ status: "error", user: user });
      } else {
        console.log(user);
        if (user === null) {
          return res.json({ status: "fail", user: user });
        } else {
          const securedUser = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
          };
          return res.json({ status: "success", user: securedUser });
        }
      }
    }
  );
});

router.post("/findUser", (req, res) => {
  const account = req.body;
  console.log('ac'+account)
  User.findOne({ user_id: account.user_id }, function (error, user) {
      if (error) {
        console.log(error);
        return res.json({ status: "error", user: user });
      } else {
        console.log(user);
        if (user === null) {
          return res.json({ status: "fail", user: user });
        } else {
          const securedUser = {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
          };
          return res.json({ status: "success", user: securedUser });
        }
      }
    }
  );
});

router.post("/profileUpdate", (req, res) => {
  // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
  console.log(req.body);

  // 프로필 업뎃할 때 필요한 정보들을 clinet에서 가져오면 그것들을 데이터베이스에 넣어준다.
  // 프로필 업뎃이 성공했다는 응답을 준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;
