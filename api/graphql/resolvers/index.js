const moment = require('moment')
const {sendTranscationToDarajaAPI} = require('../../utils/helper')
const stkPush = 'STK-PUSH'
const {fetchToken} = require('../../auth/auth');
module.exports = {
  sendSTKPush: async (req,res,args,next) => {
    try {
      req.service = stkPush;
      fetchToken(req,res);
      let businessShortCode = process.env.PAYBILL_SHORTCODE
      let timeStamp = moment().format('YYYYMMDDHHmmss')
      let rawPassword = businessShortCode + process.env.AUTHENTICATION_KEY + timeStamp

      let mpesaTransaction = {
        BusinessShortCode: businessShortCode,
        Password: Buffer.from(rawPassword).toString('base64'),
        Timestamp: timeStamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: req.stkInput.amount,
        PartyA: req.stkInput.phoneNumber,
        PartyB: BusinessShortCode,
        PhoneNumber: req.stkInput.phoneNumber,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: req.stkInput.accountReference,
        TransactionDesc: req.stkInput.description
      }
      sendTranscationToDarajaAPI({
        url: process.env.SAFARICOM_DARAJA_PROCESS_REQUEST_STK,
        auth: 'Bearer ' + req.transactionToken,
        transaction: mpesaTransaction
      },req,res,next)
      return {

      }

    } catch (e) {
      console.log(e.message)
    }
  }
}