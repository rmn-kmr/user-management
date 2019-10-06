var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var cors = require('cors')
var user = require('./src/controllers/user');
var auth = require('./src/controllers/auth');
var { authorization } = require('./src/controllers/auth');
var users = require('./src/models/user.model');
const passport    = require('passport');
require('./src/models/mongoose');
require('./lib/passport');

var app = express(); 

port = process.env.PORT || 3000;

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());


 
// api routes
app.post('/auth', auth.login);
app.post('/register', auth.register);

// middleware authorization 
app.use(authorization);

app.get('/users',user.userDocs);

app.post('/delete-user',user.deleteUser);

app.post('/refresh', auth.refresh);
app.post('/forgot-password', user.forgotPassoword);
app.post('/reset-password', user.resetPassoword);

// start server
 app.listen(port, ()=>{
   console.log(`Server is running on ${port}`);
   
 });
