const User = require('./../models/user.model');
const {sendEmail} = require('../utils/triggerEmail');

/* GET users . */

const userDocs = function (req, res) {
  User.find((err,docs) => {
    if (err) res.json(err);
    res.json(docs);
  });
};

/* DELETE user */

const deleteUser = (req,res)=>{
  const id = req.body.userID;
  User.findByIdAndDelete({_id: id},(err,user)=>{
    if(!user){
      res.json({status:false,Message:'User does not exists'});
    }
    if(err)res.json(err);
    res.json({status:true,Message:'Successfully deleted',Data:user});
  });
}

const forgotPassoword = (req, res) => {
  const email = req.body.email;
  console.log('------------------------', req.body.email);
  
  User.findOne({email})
    .then((user) => {
      if (user){
        sendEmail({
          firstName: 'email',
          lastName: '',
          to: email,
          title: 'Forgot password',
          emailType: 'forgotPassword'
        });
        res.json({status:true,Message:'reset password Email has been sent'});
      }else{
        throw new Error('Not Exists')
      }
    })
    .catch((error)=>{
      res.status(401).json({status:false, message:error.message});
    });
}

const resetPassoword = async (req, res) => {
  const {token, password} = req.body;
  try{
    if(!token){
      throw new Error('token empty');
    }
    const email = new Buffer(token, 'base64').toString('ascii');
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if(!passw.test(password)){
      throw new Error(userMessage.INVALID_PASSWORD);
    }
    var userModel = new User();
    userModel.email = email;
    userQuery = { password: userModel.hashPassword(password) };

    const updateResp = await User.updateOne({email}, { $set : userQuery }, { new: true });
    console.log(updateResp);
    
    
    res.json({status:true,Message:'Successfully updated'});

  }catch(error){
    res.status(401).json({status:false, message:error.message});
  }
};

module.exports = { userDocs , deleteUser, forgotPassoword, resetPassoword };


