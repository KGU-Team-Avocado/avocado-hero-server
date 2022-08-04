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
    // 유저아이디, 신청한그룹아이디, 결과
})

const ApplyLog = mongoose.model('ApplyLog', applyLogSchema)

module.exports = { ApplyLog }
