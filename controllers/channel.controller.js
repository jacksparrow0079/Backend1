const Channel = require("../models/Channel.model");
const User =require("../models/User.model")
const mongoose=require("mongoose")
const redis = require("../utils/redis");

const createChannel = async (req, res) => {
  try {
    const { ownerId, channelName, about } = req.body;

    const newChannel=new Channel({
        ownerId,
        channelName,
        about
    });
    await newChannel.save();

    return res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
    });
  } catch (err) {
    console.error("Error creating channel:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getAccountdetails =async(req,res)=>{
    try{
        const{userId}=req.body;

        const cachedKey = `account_details:${userId}`;
        try{

          const cachedData = await redis.get(cachedKey);

        if(cachedData){
            const cachedResult = JSON.parse(cachedData);
            return res.status(200).json({message:"data fetched from cache",data:cachedResult.data, userDetails:cachedResult.userDetails});}

        }catch(err){
            console.log("redis error",err);
        }
        const userDetails=await User.findById(userId);
        const data=await User.aggregate([
            // stage
            {
            $match:{
                _id: new mongoose.Types.ObjectId(userId)
            }
            },
            {
                $lookup:{
                    from:"channels",
                    localField:"_id",
                    foreignField:"ownerId",
                    as:"details"
                }

            },
            {
                $unwind:{
                    path:"$details"
                }
            },
             {
                $project:{
                    username:1,
                    about:1,
                    channelName:"$details.channelName",
                    about:"$details.about"

                }
             },
        ])
        // store result in redis cache with an expiration time of 1 hour (3600 seconds)
        await redis.set(cachedKey, JSON.stringify({data,userDetails}), 'EX', 100);
        return res.status(200).json({message:"data fetched",data,userDetails});

    }catch(err){
        console.log("err",err)
          return res.status(500).json({
            message: "Internal server error",
          });
    }
};
// controller to get video stast response everything at one time 
const getAllDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // create a key

    const redisKey = `all_details:${userId}`;

    try{

       const redisData = await redis.get(redisKey);

       if(redisData){
        const parsedData = JSON.parse(redisData);
        return res.status(200).json({message : "All Details Data from Redis", 
          all_details:  parsedData})
       }
    }catch(err){
      console.log("redis error", err)
    }

    const data = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "channels",
          localField: "_id",
          foreignField: "ownerId",
          as: "channel"
        }
      },
      {
         $lookup: {
          from: "videos",
          localField: "channel._id",
          foreignField: "channelId",
          as: "videos"
        }
      },
      {
         $lookup: {
          from: "videostats",
          localField: "video_id._id",
          foreignField: "video_Id",
          as: "stats"
        }
      },

    //   stage 5
   {
        // operaiton name
      $addFields: {
        // new field name - your choice
          videos: {
            // map operation - iterate
            $map: {
              // iterate on videos array
              input: "$videos",
              // videos : [{v1}, {v2}, {v3}, {v4}]
              // stats : [{s1}, {s2}, {s3}, {s4}]
              as: "video",

              /*
               {
                  ...video,

               }
              */
              in: {
                $mergeObjects: [
                  "$$video",
                  {
                    stats: {
                      $arrayElemAt: [
                        {
                          //  // stats : [{s1}, {s2}, {s3}, {s4}]
                          $filter: {
                            input: "$stats",
                            as: "stat",
                            cond: { $eq: ["$$stat.video_id", "$$video._id"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

    
    ]);

    // store it in redis

    await redis.set(redisKey, JSON.stringify(data), "EX", 100)

    return res.status(200).json({
      message: "Details fetched successfully",
      all_data: data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = { createChannel,getAccountdetails ,getAllDetails};
