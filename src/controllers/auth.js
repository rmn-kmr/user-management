const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {JWT_SECRET_KEY,JWT_EXPIRATION_TIME} = require('../../config/config');
const resStructure = require('../utils/util').resStructure; 
const userMessage = require('../utils/constants').userMessage;  
const _ = require('lodash');

/* POST login. */
const login = function (req, res) {

    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            });
        }
   //Passport exposes a login() function on req that,
  // can be used to establish a login session
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.json(err);
             }
        let userData = {_id: user._id, email: user.email,exp: Math.floor(Date.now() / 1000) + (60 * 2 )  };
        // Create a new token with the userData in the payload
        // and which expires 120 seconds after issue
            const token = jwt.sign( userData , JWT_SECRET_KEY, {
                algorithm: 'HS256' });
               res.cookie('token', token, { maxAge: JWT_EXPIRATION_TIME * 1000, httpOnly: true, secure: true });
              
            return res.json({userData, token});
        });
   })
    (req, res);

}
/* POST register. */

const register =  function (req, res) {
    // Get credentials from json body
    let body = req.body;
    let email = body.email;
    let password = body.password;
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    var emailAdd = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    // return 401 error is email or password doesn't exist
    if (_.isEmpty(email) || _.isEmpty(password)){
        res.status(401).json(resStructure(false, userMessage.FIELD_REQUIRED ));
        return;
    }
    if(!emailAdd.test(email)){
        res.status(401).json(resStructure(false, userMessage.INVALID_EMAIL));
        return;
    }
    if(!passw.test(password)){
        res.status(401).json(resStructure(false, userMessage.INVALID_PASSWORD));
        return;
    }
    
    UserModel.findOne({ email: email }, (err, doc) => {
        if (err) { res.status(500).send('error occured') }
        else {
            if (doc) {
                res.status(500).json({message: 'Username already exists'});
            } else {
                var userModel = new UserModel()
                userModel.email = email;
                userModel.password = userModel.hashPassword(password);
               
                userModel.save((err, user) => {
                    if (err) {
                        res.status(401).json(resStructure(false, userMessage.REGISTER_FAILURE, ));
                    } else {
                        res.status(201).json(resStructure(true, userMessage.REGISTER_SUCCESS, user ));
                    }
                })
            }
        }
    });

}

/* POST refresh. */

const refresh = (req, res) => {
    // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).end()
    }
  
    var payload
    try {
      payload = jwt.verify(token, JWT_SECRET_KEY)
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).end()
      }
      return res.status(400).end()
    }
    // (END) The code uptil this point is the same as the first part of the `welcome` route
  
    // We ensure that a new token is not issued until enough time has elapsed
    // In this case, a new token will only be issued if the old token is within
    // 30 seconds of expiry. Otherwise, return a bad request status
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    if (payload.exp - nowUnixSeconds > 30) {
      return res.status(400).end()
    }
  
    // Now, create a new token for the current user, with a renewed expiration time
    const newToken = jwt.sign({ email: payload.email }, JWT_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: JWT_EXPIRATION_TIME
    })
  
    // Set the new token as the users `token` cookie
    res.cookie('token', newToken, { maxAge: JWT_EXPIRATION_TIME * 1000 })
    res.end()
  }
 
  /* Middleware Authorization */

  const authorization = (req, res, next ) => {
    let unless = [
        '/auth',
        '/register'
    ];
 // We can obtain the session token from the requests cookies, which come with every request

    let token = req.cookies.token;
    
    var payload;
    try {
      // Parse the JWT string and store the result in `payload`.
      // if the token is invalid (if it has expired according to the expiry time we set on sign in),
      // or if the signature does not match
        if (!unless.includes(req.originalUrl)){
            if (!token) {
              throw new Error('Authorization key missing');
             }
            payload = jwt.verify(token, JWT_SECRET_KEY);

            next();
         }
       
    } catch (error) {
     // if the error thrown is because the JWT is unauthorized, return a 401 error

        res.status(401).json({message: error.message});
    }
}

module.exports = {login, register, refresh, authorization};
