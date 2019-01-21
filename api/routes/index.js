const express = require('express');
const router = express.Router();
const lipaNaMpesaController = require('../../api/controller/LipaNaMpesaController');
const {fetchToken} = require('../auth/auth');

router.get('/',(req,res)=>{
  res.status(200).send({
    message: 'Endpoint Working Correctly'
  })
});
router.post('/process',lipaNaMpesaController.initiateRequest,fetchToken,lipaNaMpesaController.processTransaction);

module.exports = router;