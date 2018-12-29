const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  res.status(200).send({
    message: 'Endpoint Working Correctly'
  })
});


module.exports = router;