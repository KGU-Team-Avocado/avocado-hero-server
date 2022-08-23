const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Company } = require("../models/Company");
const { User } = require("../models/User");
const { Bookmark } = require("../models/Bookmark");

router.post("/bookmarkSave", function(req, res) {
    console.log(req.body); // 프론트에서 스키마 형식에 맞는 데이터 넘겨줌
    // 데이터 저장
    
    Bookmark.updateOne(
        {user_id:req.body.user_id},
        {$push: {company_id:req.body.company_id}},
        {upsert:true},
        function(error, data){
        if(error){
            console.log(error);
            return res.json({status: 'false', error}) 
        }else{
            console.log('Saved!')
            return res.json({status: 'success'})
        }
    });
});



module.exports = router;