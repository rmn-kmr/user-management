const passport    = require('passport');
const passportJWT = require("passport-jwt");
const UserModel = require('../src/models/user.model');
const ExtractJWT = passportJWT.ExtractJwt;
const JWT_SECRET_KEY = require('../config/config').JWT_SECRET_KEY;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {

   //Assume there is a DB module providing a global UserModel
        UserModel.findOne({ email: email }, (err, user) => {
            if (err) { 
                return cb(null, false, {message: 'Incorrect email'});
             }
            else if (user) {
                var valid = user.comparePassword(password, user.password);
                if (valid) {
                    return cb(null, user, { message: 'Logged In Successfully' });
                } else{
                    return cb(null, null, { message: "Password is invalid" });
                }
            }
            else {
                // return error is email doesn't exist
                return cb(null, user,{ message: "Email does not exist" });
            }
            
        });

    }
));

