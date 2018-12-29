const moment = require('moment');
const request = require('request');
const STK_PUSH = 'STK_PUSH';
const TOKEN_INVALIDITY_WINDOW = 240;
const GENERIC_SERVER_ERROR_CODE = '01';
const Token = require('../model/token');
require('dotenv').config();

let fetchToken = (req,res,next)=>{
  console.log('Getting Token');
  let serviceName = req.body.service;
  Token.findOne({service:serviceName})
    .then(records=>{
      if(records){
        if(isTokenValid(records)){
          console.log('Token is Still Valid');
          req.transactionToken = records.accessToken;
          next();
        }else{

        }
      }
    })
    .catch(err=>{
      console.log('Error Fetching Records');
      return res.status(500).send({});
    })
};

let isTokenValid = function(service){
   var tokenAge = moment.duration(moment(new Date()).diff(service.lastUpdated)).asSeconds() + TOKEN_INVALIDITY_WINDOW;
   return (tokenAge < service.timeout)
};

let setNewAccessToken = function(req,res,serviceName,newInstance,next){
  var consumerKey =  '';
  var consumerSecret = '';
  var token = {};
  var authenticationUrl = process.env.SAFARICOM_DARAJA_AUTH_URL;

  switch (serviceName) {

    case STK_PUSH:
     consumerKey = process.env.CONSUMER_KEY;
     consumerSecret = process.env.CONSUMER_SECRET;
     break;

    default:
      consumerKey = process.env.CONSUMER_KEY;
      consumerSecret = process.env.CONSUMER_SECRET;
      break;
  }
  var auth = 'Basic ' + Buffer.from(consumerKey + ':' + consumerSecret).toString('base64');
  request({url:authenticationUrl, headers:{'Authorization': auth}},(error,response,body)=>{
    var tokenResponse = JSON.parse(body);

    if(!error || !tokenResponse.errorCode){
      var newToken = {
        lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss'),
        accessToken: tokenResponse.access_token,
        timeout: tokenResponse.expires_in,
        service: serviceName
      };
      if(newInstance){
        token = new Token(newToken);

      }else{

      }
    }
  })


};