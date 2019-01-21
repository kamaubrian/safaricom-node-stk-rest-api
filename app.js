const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const stkRoutes = require('./api/routes/index');
var swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

const graphqlHttp = require('express-graphql');
const graphqlResolvers = require('./api/graphql/resolvers/index');
const graphqlSchemas = require('./api/graphql/schemas/index');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true},(err)=>{
  if(err){
    console.log('Error Connection To Database',err.message);
    throw new Error(err.message);
  }
  console.log('MongoDB Connected Successfully');
});

app.use('/api/v1/stkpush/',stkRoutes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/graphql',graphqlHttp({
  schema: graphqlSchemas,
  rootValue: graphqlResolvers,
  graphiql:true
}))

app.use('/favicon.ico',(req,res)=>{
    res.status(200).send({});
});


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