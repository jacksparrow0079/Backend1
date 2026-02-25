const User = require("../models/User.model");

const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;

    const newUser = new User({
      username,
      email,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    console.log("err", err.mesage);
  }
}
const getUsers=async(req,res)=>{
  try{
    // pagination
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||3;
    const skip=(page-1)*limit;
const data=await User.aggregate([
  {
   $sort:{
    createdAt:1
   }
  },
  {
    $skip:skip
  },
  {
    $limit:limit
  }
])
return res.status(200).json({message:"fetched users",data})

  }catch(err){
    console.log(err);
  }
}
module.exports = { createUser,getUsers };
