const request = require('request');

function sendTranscationToDarajaAPI(transactionDetails,req,res,next){
  request({
    method: 'POST',
    url: transactionDetails.url,
    headers: {
      'Authorization': transactionDetails.auth
    },
    json: transactionDetails.transaction
  },function(error,response,body){
      httpResponseBodyProcessor({
        body:body,
        error: error
      },req,res,next)
  })
};

function httpResponseBodyProcessor(responseData,req,res,next){
  console.log('HttpResponseBodyProcessor ' + JSON.stringify(responseData));
  if(!responseData.body.fault && ! responseData.body.errorCode && !responseData.error && !isEmpty(responseData.body.status)){
    console.log('POST Response ' + JSON.stringify(responseData.body));
    req.transactionResponse =responseData.body
    next();
  }else{
    console.log('Error Occurred',JSON.stringify(responseData.body));
    return res.status(responseData.body.errorCode)
      .send({
        message:'Error Processing Request'
      })
  }
}

































