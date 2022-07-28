const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  company_id: {
    type: String,
    maxlength: 30,
    unique: 1,
  },
  company_company_name: {
    type: String,
    maxlength: 30,
  },
  company_title: {
    type: String,
    maxlength: 30,
  },
  company_field: {
    type: String,
    maxlength: 30,
  },
  company_recruit_number: {
    type: String,
    maxlength: 30,
    //unique: 1,
    trim: true, //공백제거
  },
  company_tag: {
    type: String,
  },
  company_period: {
    type: String,
    maxlength: 30,
  },
  company_site: {
    type: String,
  },
  // -- 기본 정보 --
});

const Company = mongoose.model("Company", companySchema);
module.exports = { Company };
