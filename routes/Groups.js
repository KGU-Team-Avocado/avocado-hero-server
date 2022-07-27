const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { User } = require("../models/User");
const { LoginLog } = require("../models/LoginLog");

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
  const user_id = user.user_id; // 프론트에서 post을 이용해 파라미터로 id를 넘겨줌
  User.findOne({ user_id: user_id }, function (error, result) {
    if (result == null) {
      console.log("중복아이디 없음");

      user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
          success: true,
        });
      });
    } else {
      //res.send("중복된 아이디입니다.");
      return res.json({ idCheck: false });
    }
  });
});
