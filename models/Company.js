const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
  },
  company_image: {
    type: String,
    default: null,
  },
  posting_image: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    maxlength: 30,
  },
  job_tags: [
    String
  ],
  recruit_number: {
    type: String,
    maxlength: 30,
    //unique: 1,
    trim: true, //공백제거
  },
  skill_tags: [
    String
  ],
  period: {
    type: String,
    maxlength: 30,
  },
  site: {
    type: String,
  },
  description: {
    type: String,
  },
  // -- 기본 정보 --
});

/**
 * 
 * @param field 분야
 * @param period 마감일
 * @param tag 기술
 * 
 */
const Company = mongoose.model('Company', companySchema);
module.exports = { Company };
