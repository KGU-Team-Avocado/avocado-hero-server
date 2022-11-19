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
    code: {
        type: String,
    },
    capacity: {
        type: Number,
        required: true
    },
    short_description: {
        type: String,
        required: true  // not null
    },
    long_description: {
        type: String,
        required: true  // not null
    },
    imageURL:{
        type:String,
        default:null,
    },
    tech_stack: [
        String
    ],
    manager:{
        type:String,
        required:true
    },
    notices: [
        {
            title: String,
            description: String
        }
    ],
    events: {
        recursive: [
            {
                title: String,
                description: String,
                color: String,
                allDay: Boolean,
                startRecur: Date,
                startTime: String,
                endRecur: Date,
                endTime: String,
                daysOfWeek: [ String ]
            }
        ],
        nonrecursive: [
            {
                title: String,
                description: String,
                color: String,
                allDay: Boolean,
                start: Date,
                end: Date,
            }
        ]
    },
    members: [
        {
            user_id: String,
            user_name: String,
            user_email: String,
            user_role: Array
        }
    ],
    close_application: {
        type: Boolean,
        required: true
    },
    end_project: {
        type: Boolean,
        required: true
    },
    start_date:{
        type:Date,
        default:new Date(),
    },
    end_date:{
        type:Date,
        default:null,
    },

    // 리드미
    read_me: {
        type: String,
        default:"리드미를 작성해주세요.",
        required: true  // not null
    },

    // 지역
    local1: {
        type: String,
        default: "지역을 설정해주세요.",
        required: true // not null
    },

    local2: {
        type: String,
        default: "지역을 설정해주세요.",
        required: true // not null
    },

    local3: {
        type: String,
        default: "지역을 설정해주세요.",
        required: true // not null
    }
})

const Group = mongoose.model('Group', groupSchema)

module.exports = { Group }
