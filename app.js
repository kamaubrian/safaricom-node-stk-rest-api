const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());



app.use(function(req,res,next){
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});
app.use(function(err,req,res){
  res.status(err.status || 500);
  res.json({
    err:{
      message:err.message
    }
  })
});
module.exports = app;





module.exports = app;