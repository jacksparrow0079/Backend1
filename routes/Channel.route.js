const express=require("express");
const {createChannel, getAccountdetails, getAllDetails}=require("../controllers/channel.controller.js");


//router 
const router = express.Router();
router.post("/create-channel",createChannel)
router.get("/GetAccountDetails",getAccountdetails)
router.get("/GetAllDetails/:userId",getAllDetails);
module.exports=router;