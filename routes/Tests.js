const express = require('express')
const router = express.Router();
const { Test } = require("../models/Test");

// http://localhost:8080 에서 확인하기 쉽도록 get을 위주로 구현하였지만 실제 프론트에서 사용할 때 데이터를 넘기는 것은 post 방식이 더 쉽고 보안적으로도 좋다고 생각함.

/* GET. */
router.get('/find', function (req, res, next) {
    // 전체 데이터 가져오기
    Test.find().then((tests) => {
        // console.log(tests);
        res.json(tests)
    }).catch((err) => {
        console.log(err);
        next(err)
    });
});

router.get('/findOne/:test_id', function (req, res) {
    // 특정 아이디값 가져오기
    const id = req.params.test_id;
    // 프론트에서 get을 이용해 파라미터로 id를 넘겨줌 
    // 아래에 post를 이용하는 것도 작성함
    Test.findOne({ test_id: id }, function (error, test) {
        if (error) {
            console.log(error);
        } else {
            res.json(test)
        }
    });
});

// 테스트를 위해 랜덤 id로 새로운 데이터 저장
router.get('/save', function(req, res) {
    const test_id = Math.floor(Math.random() * 1000);
    // 데이터 저장
    var newTest = new Test({test_id: test_id, test_num: 1}); // required가 true가 아니면 생략해도 저장 가능
    newTest.save(function(error, test){
        if(error){
            console.log(error);
            return res.json({status: 'duplicated', error}) // unique를 1로 줬던 필드의 값이 겹침(중복)
        }else{
            console.log('Saved!')
            return res.json({status: 'success', data: test})
        }
    });
});

router.get('/modify/:test_id', function(req, res, next) {
     // 특정 아이디값 가져오기
     const test_id = req.params.test_id; 
    // 특정아이디 수정하기
    Test.updateOne(
        { test_id: test_id }, 
        {$push: {test_json_list: {
            "date": "asdf", 
            "value": "qwer",
            "isDone": true,
            "key": "123"
        }}}).exec((error, output)=>{
            if(error){
                console.log(error);
                res.json({status: 'error', error})
            }else{
                console.log('Saved!')
                res.json({status: 'success', output: output})
            }
        });
});

router.get('/delete/:test_id', function(req, res, next) {
    // 삭제
    Test.remove({test_id: req.params.test_id}, function(error,output){
        console.log('--- Delete ---');
        if(error){
            console.log(error);
        }
        res.json({status: 'success', output: output})
        console.log('--- deleted ---');
    });
});

/* POST */
router.post('/save', function(req, res) {
    console.log(req.body); // 프론트에서 스키마 형식에 맞는 데이터 넘겨줌
    // 데이터 저장
    var newTest = new Test(req.body.data);
    newTest.save(function(error, data){
        if(error){
            console.log(error);
            return res.json({status: 'duplicated', error}) // unique를 1로 줬던 필드의 값이 겹침(중복)
        }else{
            console.log('Saved!')
            return res.json({status: 'success'})
        }
    });
});

router.post('/findOne/', function(req, res) {
    // 특정 아이디값 가져오기
    const test_id = req.body.data.test_id; // 프론트에서 post을 이용해 파라미터로 id를 넘겨줌
    User.findOne({test_id: test_id}, function(error,tests){
        if(error){
            console.log(error);
        }else{
            res.json(tests)
        }
    });
});

module.exports = router;