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
    // Todo.findOne({project_id: project_id}, function(error,todos){
    //     if(error){
    //         console.log(error);
    //     }else{
    //         console.log(todos);
    //         res.json(todos)
    //     }
    // });
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

module.exports = router;