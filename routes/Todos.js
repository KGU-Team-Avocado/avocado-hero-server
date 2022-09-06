const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Todo } = require("../models/Todo");

router.post("/todoCreate", (req,res) => {
    console.log(req.body);

    const todo = new Todo(req.body);
    todo.save((err) => {
        if (err) return res.json({success: false, err});
        return res.status(200).json({
            success: true,
        });
    });
})

module.exports = router;