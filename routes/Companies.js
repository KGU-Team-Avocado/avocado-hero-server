const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { User } = require("../models/User");
const { Company } = require("../models/Company");
const { LoginLog } = require("../models/LoginLog");
const multer = require('multer')


// //application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// //application/json
// app.use(bodyParser.json());

// router.post("/register", (req, res) => {
//   // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
//   console.log(req.body);

//   // 회원가입할 때 필요한 정보들을 client에서 가져오면
//   // 비밀번호를 암호화하여
//   // 그것들을 데이터베이스에 넣어준다.
//   // 회원가입이 성공했다는 응답을 준다.
//   const user = new User(req.body);
//   const user_id = user.user_id; // 프론트에서 post을 이용해 파라미터로 id를 넘겨줌
//   User.findOne({ user_id: user_id }, function (error, result) {
//     if (result == null) {
//       console.log("중복아이디 없음");

//       user.save((err, userInfo) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).json({
//           success: true,
//         });
//       });
//     } else {
//       //res.send("중복된 아이디입니다.");
//       return res.json({ idCheck: false });
//     }
//   });
// });

// router.post("/login", (req, res) => {
//   // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
//   const account = req.body;
//   User.findOne(
//     {
//       $and: [{ user_id: account.id }, { user_password: account.password }],
//     },
//     function (error, user) {
//       if (error) {
//         console.log(error);
//         return res.json({ status: "error", user: user });
//       } else {
//         console.log(user);
//         if (user === null) {
//           return res.json({ status: "fail", user: user });
//         } else {
//           LoginLog.find().then((tests) => {
//             new LoginLog({ secure_num:tests.length, user_id: user.user_id, time: new Date() }).save();
//           }).catch((err) => {
//             console.log('hello there');
//             console.log(err);
//           });
//           const securedUser = {
//             user_id: user.user_id,
//             user_name: user.user_name,
//             user_email: user.user_email,
//           };
//           return res.json({ status: "success", user: securedUser });
//         }
//       }
//     }
//   );
// });

// router.post("/findUser", (req, res) => {
//   const account = req.body;
//   console.log("ac" + account);
//   User.findOne({ user_id: account.user_id }, function (error, user) {
//     if (error) {
//       console.log(error);
//       return res.json({ status: "error", user: user });
//     } else {
//       console.log(user);
//       if (user === null) {
//         return res.json({ status: "fail", user: user });
//       } else {
//         const securedUser = {
//           user_id: user.user_id,
//           user_name: user.user_name,
//           user_email: user.user_email,
//         };
//         return res.json({ status: "success", user: securedUser });
//       }
//     }
//   });
// });

// router.post("/profileUpdate", (req, res) => {
//   const account = req.body;
  
//   console.log(req.body);

//   User.findByIdAndUpdate(account.user_id, req.body, {
//      new: true, 
//     },
//     function (error, user) {
//       if (error) {
//         console.log(error);
//         return res.json({ status: "error", user: user });
//       } else {
//         console.log(user);
//       }
//     }
//     ).exec();
    
// });

//업로드 관련 코드 시작
const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadedFile/image/company')
  },
  filename: (req, file, cb) => {
    const fileName = `${req.body.posting_id}.company.${file.originalname.split('.').reverse()[0]}`
    console.log(fileName)
    cb(null, fileName)
  },
})

const postingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadedFile/image/company')
  },
  filename: (req, file, cb) => {
    const fileName = `${req.body.posting_id}.posting.${file.originalname.split('.').reverse()[0]}`
    console.log(fileName)
    cb(null, fileName)
  },
})

const companyUpload = multer({ storage: companyStorage })
const postingUpload = multer({ storage: postingStorage })

router.post('/uploadposingImage', postingUpload.single('file'), function (req, res) {
  const fileName = `${req.body.posting_id}.posting.${req.file.originalname.split('.').reverse()[0]}`
  Company.updateOne(
    { _id: req.body.posting_id },
    { posting_image: fileName },
    function (req, res) {
    }
  )
  res.json({})
})

router.post('/uploadcompanyImage', companyUpload.single('file'), function (req, res) {
  const fileName = `${req.body.posting_id}.company.${req.file.originalname.split('.').reverse()[0]}`
  Company.updateOne(
    { _id: req.body.posting_id },
    { company_image: fileName },
    function (req, res) {
    }
  )
  res.json({})
})

router.post("/jobPost", (req,res) => {
  
  // const companies = {
  //   company_id: company.company_id,
  //   company_company_name: company.company_company_name,
  //   company_title: company.company_title,
  //   company_field: company.company_field,
  //   company_recruit_number: company.company_recruit_number,
  //   company_tag: company.company_tag,
  //   company_period: company.company_period,
  //   company_site: company.company_site,
  // };

  const company = new Company(req.body);
  const title = company.title;
  console.log(req.body);

  Company.findOne({ title: title }, function (error, result) {
    if (result == null) {
      console.log("중복된 제목의 글 없음");

      company.save((err, company) => {
        if (err) return res.json({ success: false, err });
        console.log("하이");
        return res.status(200).json({
          success: true,
          company: company
        });
      });
    } else {
      //res.send("중복된 제목의 글 입니다.");
      return res.json({ compIdCheck: false });
    }
  });

  // return res.json({company:companies});

});

router.get('/getPost', function (req, res, next) {
  // 전체 데이터 가져오기
  
  Company.find().then((companies) => {
      // console.log(tests);
      res.json(companies)
  }).catch((err) => {
      console.log(err);
      next(err)
  });
});

module.exports = router;
