const mongoose = require('mongoose');
const tokenSchema = mongoose.Schema({
  lastUpdated: {type:String,required:true},
  accessToken: {type:String,required:true},
  timeout: {type:String,required:true},
  service: {type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Token',tokenSchema);