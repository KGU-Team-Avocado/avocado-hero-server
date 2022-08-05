const mongoose = require('mongoose');

const applyLogSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true  // not null
    },
    group_id: {
        type: String,
        required: true  // not null
    },
    status: {
        type: String,
        required: true  // not null
    },
    message: {
        type: String,
    },
    // 유저아이디, 신청한그룹아이디, 결과, 자기소개
})

const ApplyLog = mongoose.model('ApplyLog', applyLogSchema)

module.exports = { ApplyLog }
