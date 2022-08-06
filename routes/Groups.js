const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Group } = require("../models/Group");
const { ApplyLog } = require("../models/ApplyLog");

router.post("/create", (req, res) => {
  console.log(req.body);
  const group = new Group(req.body);
  group.save((err) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.get("/getGroup", (req, res, next) => {
  Group.find().then((tests) => {
    // console.log(tests);
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/apply", (req, res) => {
  // console.log(req.body);
  ApplyLog.findOne( {
    $and: [
       { user_id: req.body.user_id },
       { group_id : req.body.group_id }
    ]
 }, function (error, result) {
    if (result == null) {
      console.log("중복아이디 없음");
      const group = new ApplyLog(req.body);
      group.save((err) => {
        if (err){
          return res.json({ success: false, err }); 
        } 
        else{
          const filter = { _id : req.body.group_id };
          const update = { $push: { applied: req.body.user_id } };
          Group.findOneAndUpdate(filter, update, function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
                return res.status(200).json({
                  success: true,
                });        
            }
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
  ApplyLog.find({ user_id : req.body.user_id }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getMyGroup", (req, res, next) => {
  console.log(req.body);
  Group.find({ members : req.body.user_id }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

router.post("/getApplicants", (req, res, next) => {
  // console.log(req.body);
  ApplyLog.find({ user_id : req.body.group_id }).then((tests) => {
    res.json(tests)
  }).catch((err) => {
    console.log(err);
    next(err)
  });
});

module.exports = router;