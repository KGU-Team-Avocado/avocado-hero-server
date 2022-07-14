const mongoose = require("mongoose");

const loginLogSchema = mongoose.Schema({
    secure_num: {
        type: Number,
    },
    user_id: {
        type: String,
        maxlength: 30,
    },
    time: {
        type: Date,
    },
});

const LoginLog = mongoose.model("LoginLog", loginLogSchema);
module.exports = { LoginLog };
