const mongoose = require('mongoose');

// 자주 쓰는 데이터 타입
const organizationSchema = mongoose.Schema({
    // _id는 새로운 데이터가 생성될 때 mongodb에서 자동으로 만들어주는 기본키임. 스키마를 생성할 때 따로 작성하지 않아도 됨.
    user_id: {
        type: String,
        required: true  // not null
    },
    title: {
        type: String,
        required: true  // not null
    },
    code: {
        type: String,
        required: true  // not null
    },
    notice: {
        type: String,
        required: true  // not null
    },
    maxTeam: {
        type: Number,
        required: true  // not null
    },
    maxMember: {
        type: Number,
        required: true  // not null
    },
})

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = { Organization }
