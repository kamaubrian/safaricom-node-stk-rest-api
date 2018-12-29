const express = require('express');
const router = express.Router();
const lipaNaMpesaController = require('../../api/controller/LipaNaMpesaController');
const auth = require('../auth/auth');

router.get('/',(req,res)=>{
  res.status(200).send({
    message: 'Endpoint Working Correctly'
  })
});
router.post('/process',lipaNaMpesaController.initiateRequest,auth,lipaNaMpesaController.processTransaction);

module.exports = router;