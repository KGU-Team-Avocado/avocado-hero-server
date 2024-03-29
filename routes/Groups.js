const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Group } = require("../models/Group");
const { ApplyLog } = require("../models/ApplyLog");
const multer = require('multer')
const path = require("path");
const { Organization } = require("../models/Organization");

//업로드 관련 코드 시작
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadedFile/image/group')
  },
  filename: (req, file, cb) => {
    const fileName = `${req.body.group_id}.${file.originalname.split('.').reverse()[0]}`
    console.log(fileName)
    cb(null, fileName)
  },
})

const upload = multer({ storage: storage })

router.post('/uploadImage', upload.single('file'), function (req, res) {
  const fileName = `${req.body.group_id}.${req.file.originalname.split('.').reverse()[0]}`
  Group.updateOne(
    { _id: req.body.group_id },
    { imageURL: fileName },
    function (req, res) {
    }
  )
  res.json({})
})

//업로드 관련 코드 끝

// 사진 찾기 관련 코드 시작

router.get('/groupImage/:url', function (req, res) {
  // 특정 아이디값 가져오기
  const url = req.params.url;
  // 프론트에서 get을 이용해 파라미터로 id를 넘겨줌 
  // console.log(url)
  res.sendFile(path.join(__dirname, `../uploadedFile/image/group/${url}`), function (err) {
    if (err) {
      res.json({})
    }
  });
});

// 사진 찾기 관련 코드 끝

router.post("/create", (req, res) => {
  console.log(req.body);
  const group = new Group(req.body);
  group.save((err, group) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      group: group,
    });
  });
});

router.get("/getGroups", (req, res, next) => {
  Group.find().limit(3).then((tests) => {
    console.log(tests);
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getGroupByCode", (req, res, next) => {
  Group.find(req.body).then((tests) => {
    console.log(tests);
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getGroupsInfinity", (req, res, next) => {
  const code = req.body.code;
  const skip = req.body.skip;
  const limit = req.body.limit;
  console.log(req.body);
  let maxCount = 0;
  Group.count({code:code}, function (err, count) {
    maxCount = count
    console.log("Number of groups:", count);
  })
  Group.find({code:code}, undefined, { skip, limit: limit })
  .sort({"_id":-1})
  .then((tests) => {
    res.json({ maxCount: maxCount, groups: tests })
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/apply", (req, res) => {
  // console.log(req.body);
  ApplyLog.findOne({
    $and: [
      { user_id: req.body.user_id },
      { group_id: req.body.group_id }
    ]
  }, function (error, result) {
    if (result == null) {
      console.log("중복아이디 없음");
      const group = new ApplyLog(req.body);
      group.save((err) => {
        if (err) {
          return res.json({ success: false, err });
        }
        else {
          //   const filter = { _id : req.body.group_id };
          //   const update = { $push: { applied: req.body.user_id } };
          //   Group.findOneAndUpdate(filter, update, function (error, success) {
          //     if (error) {
          //         console.log(error);
          //     } else {
          //         console.log(success);
          //         return res.status(200).json({
          //           success: true,
          //         });        
          //     }
          // });
          return res.status(200).json({
            success: true,
          });
        }
      });

    } else {
      console.log('어어')
      return res.json({ success: false });
    }
  });

});

router.post("/getAppliedGroup", (req, res, next) => {
  // console.log(req.body);
  ApplyLog.find({ user_id: req.body.user_id }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getMyGroup", (req, res, next) => {
  console.log(req.body);
  Group.find({ 'members.user_id': req.body.user_id }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getApplicants", (req, res, next) => {
  // console.log(req.body);
  ApplyLog.find({
    $and: [
      { status: "대기" },
      { group_id: req.body.group_id }
    ]
  }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/acceptApplicant", async (req, res, next) => {
  // console.log(req.body);
  let applyLog = {};

  const apply = await ApplyLog.deleteOne({ _id: req.body._id }).then((tests) => {
    ApplyLog.find({
      $and: [
        { status: "대기" },
        { group_id: req.body.group_id }
      ]
    }).then((tests) => {
      applyLog = tests;
    }).catch((err) => {
      console.log(err);
      next(err)
    });
  }).catch((err) => {
    console.log(err);
    next(err)
  });

  const filter = { _id: req.body.group_id };
  const update = { $push: { members: req.body.data } };
  Group.findOneAndUpdate(filter, update, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log(success);
      Group.findOne({ _id: req.body.group_id }).then((group) => {
        res.json({ applicants: applyLog, members: group.members })
      }).catch((err) => {
        console.log(err);
        next(err)
      });
    }
  });
});

router.post("/rejectApplicant", (req, res, next) => {
  // console.log(req.body);
  ApplyLog.updateOne({ _id: req.body._id }, { status: "반려" }).then((tests) => {
    ApplyLog.find({
      $and: [
        { status: "대기" },
        { group_id: req.body.group_id }
      ]
    }).then((applicants) => {
      res.json(applicants);
    }).catch((err) => {
      console.log(err);
      next(err)
    });
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});


router.post("/cancleAccept", (req, res, next) => {
  // console.log(req.body);
  Group.updateOne(
    { "_id": req.body.project_id },
    {
      $pull: {
        members: { "user_id": req.body.user_id }
      }
    }).exec((error, notices) => {
      if (error) {
        console.log(error);
        return res.json({ status: 'error', error })
      } else {
        Group.findOne({ _id: req.body.project_id }).then((group) => {
          res.json(group.members)
        }).catch((err) => {
          console.log(err);
          next(err)
        });
      }
    });
});

router.post("/getGroup", (req, res, next) => {

  Group.findOne({ _id: req.body._id }).then((tests) => {
    return res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/saveNewNotice", (req, res, next) => {
  Group.updateOne(
    { "_id": req.body._id },
    {
      $push: {
        notices: req.body.notice
      }
    }).exec((error, notices) => {
      if (error) {
        console.log(error);
        return res.json({ status: 'error', error })
      } else {
        Group.findOne({ _id: req.body._id }).then((group) => {
          res.json(group.notices)
        }).catch((err) => {
          console.log(err);
          next(err)
        });
      }
    });
});

router.post("/deleteNotice", (req, res, next) => {
  Group.updateOne(
    { "_id": req.body._id },
    {
      $pull: {
        notices: { "_id": req.body.notice_id }
      }
    }).exec((error, notices) => {
      if (error) {
        console.log(error);
        return res.json({ status: 'error', error })
      } else {
        Group.findOne({ _id: req.body._id }).then((group) => {
          res.json(group.notices)
        }).catch((err) => {
          console.log(err);
          next(err)
        });
      }
    });
});

router.post("/modifyNotice", (req, res, next) => {
  Group.updateOne(
    { '_id': req.body._id, },
    { $set: { "notices.$[elem]": req.body.notice } },
    { arrayFilters: [{ "elem._id": req.body.notice_id }] }).exec((error, notice) => {
      if (error) {
        console.log(error);
        return res.json({ status: 'error', error })
      } else {
        console.log('modified!')
        Group.findOne({ _id: req.body._id }).then((group) => {
          res.json(group.notices)
        }).catch((err) => {
          console.log(err);
          next(err)
        });
      }
    });
});

router.post("/saveNewEvent", async (req, res, next) => {
  if (req.body.mode === 'recursive') {
    const events = await Group.updateOne(
      { "_id": req.body._id },
      {
        $push: {
          'events.recursive': req.body.event
        }
      }).exec();
  } else if (req.body.mode === 'nonrecursive') {
    const events = await Group.updateOne(
      { "_id": req.body._id },
      {
        $push: {
          'events.nonrecursive': req.body.event
        }
      }).exec();
  }
  Group.findOne({ _id: req.body._id }).then((group) => {
    res.json(group.events)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/modifyEvent", async (req, res, next) => {
  const events = await Group.updateOne(
    { '_id': req.body._id, },
    { $set: { "events.nonrecursive.$[elem].start": req.body.start, "events.nonrecursive.$[elem].end": req.body.end } },
    { arrayFilters: [{ "elem._id": req.body.event_id }] }).exec();

  Group.findOne({ _id: req.body._id }).then((group) => {
    res.json(group.notices)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/deleteEvent", async (req, res, next) => {
  if (req.body.mode === 'recursive') {
    const events = await Group.updateOne(
      { "_id": req.body._id },
      {
        $pull: {
          'events.recursive': { "_id": req.body.event_id }
        }
      }).exec();
  } else if (req.body.mode === 'nonrecursive') {
    const events = await Group.updateOne(
      { "_id": req.body._id },
      {
        $pull: {
          'events.nonrecursive': { "_id": req.body.event_id }
        }
      }).exec();
  }

  Group.findOne({ _id: req.body._id }).then((group) => {
    res.json(group.events)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/updateRole", async (req, res, next) => {
  const members = await Group.updateOne(
    { '_id': req.body._id, },
    { $set: { "members.$[elem].user_role": req.body.user_role } },
    { arrayFilters: [{ "elem.user_id": req.body.user_id }] }).exec();

  Group.findOne({ _id: req.body._id }).then((group) => {
    res.json(group.members)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/modifyClose", (req, res, next) => {
  Group.updateOne(
    { '_id': req.body.project_id, },
    { $set: { "close_application": req.body.close_application } }).exec((error) => {
      if (error) {
        console.log(error);
        return res.json({ status: 'error', error })
      } else {
        console.log('modified!')
        Group.findOne({ _id: req.body.project_id }).then((group) => {
          return res.json(group.close_application)
        }).catch((err) => {
          console.log(err);
          next(err)
        });
      }
    });
});

router.post("/endProject", async (req, res, next) => {
  const members = await Group.updateOne(
    { '_id': req.body._id, },
    {
      $set: {
        "close_application": true,
        "end_project": true,
        "end_date": new Date()
      }
    }).exec();

  Group.findOne({ _id: req.body._id }).then((group) => {
    res.json(group)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/groupFiltering", (req, res, next) => {
  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  const gnRegex = regex(req.body.group_name);
  const pnRegex = regex(req.body.project_name);
  // const mgrRegex = regex(req.body.manager);
  let projectStackAgg = { project_stack: { $exists: true } };
  let techStackAgg = { tech_stack: { $exists: true } };
  let roleStackAgg = { role_stack: { $exists: true } };

  if (req.body.project_stack.length !== 0) {
    projectStackAgg = { project_stack: { $in: req.body.project_stack } }
  }
  if (req.body.tech_stack.length !== 0) {
    techStackAgg = { tech_stack: { $in: req.body.tech_stack } }
  }
  if (req.body.role_stack.length !== 0) {
    roleStackAgg = { role_stack: { $in: req.body.role_stack } }
  }

  Group.find({
    $and: [
      { group_name: { $regex: gnRegex } },
      { project_name: { $regex: pnRegex } },
      // { manager: { $regex: mgrRegex } },
      projectStackAgg,
      techStackAgg,
      roleStackAgg   
    ]
  }).then((groups) => {
    return res.json(groups)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/modifyReadme", (req, res, next) => {
  console.log("왔을까?"); // 왔어요
  console.log(req.body);
  Group.updateOne(
    { '_id': req.body.id, },
    { read_me: req.body.read_me },
    ).exec((error) => {
      if (error) {
        console.log(error);
        return res.json({ status: 'error', error })
      } else {
        return res.json({ status: 'success' });
      }
    });
})

router.post("/createOrganization", (req, res, next) => {
  const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  const origin = req.body;
  const coded = {
    ...origin,
    ['code']: generateRandomString(5)
  }
  const organization = new Organization(coded);
  organization.save((err, organization) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      organization: organization,
    });
  });
})


router.post("/getOrganizations", (req, res, next) => {
  Organization.find({ 'user_id': req.body.user_id }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getOrganization", (req, res, next) => {
  Organization.findOne({ 'code': req.body.code }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

// 스키마 변경 전의 그룹 데이터에 랜덤 그룹 정원 저장을 위한 코드
router.get("/setAllCapacity", (req, res, next) => {
  Group.find({}).then((groups) => {
    groups.map((group) => {
      Group.updateOne(
        { _id: group._id },
        { $set: { "capacity": Math.floor(Math.random() * 10) + 1 } },
      ).exec((error) => {
        if (error) {
          console.log(error);
          return res.json({ status: 'error', error })
        } else {
          return res.json({ status: 'success' });
        }
      })
    })
  })
})

module.exports = router;