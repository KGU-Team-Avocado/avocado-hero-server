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

  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 비밀번호를 암호화하여
  // 그 것들을 데이터베이스에 넣어준다.
  // 회원가입이 성공했다는 응답을 준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

module.exports = router;