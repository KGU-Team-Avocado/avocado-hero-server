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

router.post("/getEvalStatistics", async (req, res, next) => {
    const evalStatistics = await Evaluation.aggregate([
        { $match: { to: req.body.user_id }},
        { $unwind: "$score_eval" },
        {
            $group: {
                _id: "$score_eval.label",
                Value: { $avg: "$score_eval.avg_score" }
            }
        },
        {
            $group: {
                _id: 0,
                score_eval: { $push: { label: "$_id", [req.body.user_id]: "$Value" } }
            }
        },
        {
            $project: { score_eval: 1, _id: 0 }
        }
    ])
    res.json(evalStatistics);
})

module.exports = router;