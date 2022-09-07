const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const todoSchema = mongoose.Schema({
    // todo_id: {
    //     type: String,
    //     maxlength: 30,
    // },
    todo_text: {
        type: String,
        maxlength: 100,
    },
    todo_isChecked: {
        type: Boolean,
    },
    project_id: {
        type: String,
    }
})

const Todo = mongoose.model("Todo", todoSchema);
module.exports = { Todo };