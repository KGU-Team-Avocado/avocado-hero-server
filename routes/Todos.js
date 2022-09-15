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

router.post("/postFind", (req, res) => {
    console.log("Todos.js postFindOne입니당");
    console.log(req.body);
    // 특정 아이디값 가져오기
    const project_id = req.body.project_id; // 프론트에서 post을 이용해 파라미터로 id를 넘겨줌
    Todo.find( {
        project_id : project_id
    },
        function(error,todos){
                if(error){
                    console.log(error);
                }else{
                    console.log(todos);
                    res.json(todos)
                }
            }
    )
});

router.post("/updateIsChecked", (req, res) => {
    console.log(req.body)
    Todo.findByIdAndUpdate(
        {_id: req.body._id}, 
        { todo_isChecked: req.body.todo_isChecked}, 
        {
        new: true,
    },
    function (error, todos) {
              if (error) {
                console.log(error);
                return res.json({ status: "error", todos: todos });
              } else {
                console.log(todos);
              }
            }
            )
});

router.post("/Delete", (req, res) => {
    console.log("삭제" + req.body._id)
    Todo.findOneAndDelete(
        {_id : req.body._id},

        function(error,todos){
            if(error){
                console.log(error);
            }else{
                console.log(todos);
                res.json(todos)
            }
        }
    )
})

module.exports = router;