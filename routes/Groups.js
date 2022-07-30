const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Group } = require("../models/Group");

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
module.exports = router;