const mongoose = require('mongoose');

// 자주 쓰는 데이터 타입
const testSchema = mongoose.Schema({
    // _id는 새로운 데이터가 생성될 때 mongodb에서 자동으로 만들어주는 기본키임. 스키마를 생성할 때 따로 작성하지 않아도 됨.
    test_id: {
        type: String,
        maxlength: 30,
        unique: 1,  // 기본키와 같은 역할을 해줌
        required: true  // not null
    },
    test_num: {
        type: Number,
        default: 0
    },
    test_date: {
        type: Date
    },
    test_bool: {
        type: Boolean,
        default: false
    },
    test_list: [
        String
    ],
    test_json: {
        one: String,
        two: Number,
        three: Boolean
    },
    test_json_list: [{
        date: String,
        value: String,
        isDone: Boolean,
        key: String
    }],
})

const Test = mongoose.model('Test', testSchema)

module.exports = { Test }