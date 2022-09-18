const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Evaluation } = require("../models/Evaluation");

router.post("/saveEvaluation", async (req, res, next) => {
    const eval = new Evaluation(req.body);
    eval.save((err) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

  module.exports = router;