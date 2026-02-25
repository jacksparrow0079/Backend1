const express =require("express");
const dotenv=require("dotenv").config();
const mongoose=require("mongoose");
const PORT=process.env.PORT||4000

const userRouter=require("./routes/User.routes.js")
const channelRouter=require("./routes/Channel.route.js")
const VideoRouter =require("./routes/Video.routes.js")


const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("db is connected ")
}).catch((err)=>{
    console.log("err",err.message);
})
app.use("/api",userRouter);
app.use("/api/channel",channelRouter);
app.get("/",(req,res)=>{
    return res.status(200).json({message:"welcome to youtube Backend"});
})
app.use("/api/video",VideoRouter);

app.listen(4000,()=>{
    console.log("server is running on port "+ PORT);
})