const Users = require('../models/user.model');

/* GET users . */

let userDocs = function (req, res) {
  Users.find((err,docs) => {
    if (err) res.json(err);
    res.json(docs);
  });
};

/* DELETE user */

let deleteUser = (req,res)=>{
  const id = req.body.userID;
  Users.findByIdAndDelete({_id: id},(err,user)=>{
    if(!user){
      res.json({status:false,Message:'User does not exists'});
    }
    if(err)res.json(err);
    res.json({status:true,Message:'Successfully deleted',Data:user});
  });
}

module.exports = { userDocs , deleteUser };


