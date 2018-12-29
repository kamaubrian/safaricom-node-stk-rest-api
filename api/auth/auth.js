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
          console.log('Token Has Expired');
          setNewAccessToken(req,res,serviceName,false,next);
        }
      }else{
        console.log('Token Does not Exist');
        setNewAccessToken(req,res,serviceName,true,next);
      }
    })
    .catch(err=>{
      console.log('Error Fetching Records',err.message);
      return res.status(500).send({
        message:'Error Fetching Records',
        error:err.message
      });
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
        token.save()
          .then(result=>{
              req.transactionToken = token.accessToken;
              next();
          })
          .catch(err=>{
            console.log('Error Saving Record',err.message);
            return res.status(500)
              .send({
                message:'Error Saving Token Record',
                error:err.message
              })
          });
      }else{
        var conditions = {service:serviceName};
        var options = {multi:true};

        Token.update(conditions,newToken,options,function(err,record){
          if(err){
            console.log('Unable to Update Token ',err.message);
            return res.status(500).send({
              message:'Error Handling Update Tokens',
              error:err.message
            })
          }else{
            if(record){
              req.transactionToken = newToken.accessToken;
            }
          }
          next();
        })
      }
    }else{
      console.log('Error Fetching Response',tokenResponse.errorCode);
      return res.status(500).send({
        message:'Error Getting Daraja Response',
        error:tokenResponse.error.message
      })
    }
  });

};
module.exports = fetchToken;