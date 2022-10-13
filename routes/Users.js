const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { User } = require("../models/User");
const { LoginLog } = require("../models/LoginLog");
const multer = require('multer')
const path = require("path");

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

router.post("/login", (req, res) => {
  // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
  const account = req.body;
  console.log(account)
  User.findOne(
    {
      $and: [{ user_id: account.id }, { user_password: account.password }],
    },
    function (error, user) {
      if (error) {
        console.log(error);
        return res.json({ status: "error", user: user });
      } else {
        console.log(user)
        console.log('---')
        if (user === null) {
          return res.json({ status: "fail", user: user });
        } else {
          console.log(new User())
          LoginLog.find().then((tests) => {
            new LoginLog({ secure_num: tests.length, user_id: user.user_id, time: new Date() }).save();
          }).catch((err) => {
            console.log(err);
          });
          // const securedUser = {
          //   user_id: user.user_id,
          //   user_name: user.user_name,
          //   user_email: user.user_email,
          // };
          delete user._doc.user_password
          return res.json({ status: "success", user });
        }
      }
    }
  );
});

router.post("/findUser", (req, res) => {
  const account = req.body;
  console.log("ac" + account);
  User.findOne({ user_id: account.user_id }, function (error, user) {
    if (error) {
      console.log(error);
      return res.json({ status: "error", user: user });
    } else {
      // console.log(user);
      if (user === null) {
        return res.json({ status: "fail", user: user });
      } else {
        let securedUser = user
        securedUser['user_password'] = ""
        console.log(securedUser)
        return res.json({ status: "success", user: securedUser });
      }
    }
  });
});


router.post("/findUsers", (req, res) => {
  User.find({}, function (error, user) {
    console.log(user)
    if (error) {
      console.log(error);
      return res.json({ status: "error", user: user });
    } else {
      return res.json({ status: "success", user: user });
    }
  });
});

router.post("/profileUpdate", (req, res) => {
  const account = req.body;

  console.log(req.body);

  User.findOneAndUpdate({ user_id: { $eq: account.user_id } },
    req.body, null, function (err, docs) {
      if (err) {
        console.log(err)
      }
      else {
        console.log("Original Doc : ", docs);
      }
    });

});

//업로드 관련 코드 시작

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadedFile/image/profile')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.post('/uploadImage', upload.single('file'), function (req, res) {
  res.json({})
})

//업로드 관련 코드 끝

// 사진 찾기 관련 코드 시작

router.get('/profileImage/:id', function (req, res) {
  // 특정 아이디값 가져오기
  const id = req.params.id;
  // 프론트에서 get을 이용해 파라미터로 id를 넘겨줌 
  console.log(id)
  res.sendFile(path.join(__dirname, `../uploadedFile/image/profile/${id}`));
});

// 사진 찾기 관련 코드 끝

module.exports = router;
