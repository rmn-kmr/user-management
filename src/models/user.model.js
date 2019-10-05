const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema =mongoose.Schema;

const userSchema  = new schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
   }

});

userSchema.methods.hashPassword= function(password){
    var salt = bcrypt.genSaltSync(10);
    return  bcrypt.hashSync(password, salt);
}

userSchema.methods.comparePassword = function(password,hash){
        return bcrypt.compareSync(password,hash);
}
const users = mongoose.model('users',userSchema);

module.exports = users;
