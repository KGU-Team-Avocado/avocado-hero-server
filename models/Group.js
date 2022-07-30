const mongoose = require('mongoose');

// 자주 쓰는 데이터 타입
const groupSchema = mongoose.Schema({
    // _id는 새로운 데이터가 생성될 때 mongodb에서 자동으로 만들어주는 기본키임. 스키마를 생성할 때 따로 작성하지 않아도 됨.
    group_name: {
        type: String,
        required: true  // not null
    },
    project_name: {
        type: String,
        required: true  // not null
    },
    short_description: {
        type: String,
        required: true  // not null
    },
    long_description: {
        type: String,
        required: true  // not null
    },
    tech_stack: [
        String
    ],
    manager:{
        type:String,
        required:true
    }
})

const Group = mongoose.model('Group', groupSchema)

module.exports = { Group }
