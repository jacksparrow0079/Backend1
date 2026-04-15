// configuration for redis client
const Redis = require('ioredis');


const redis =new Redis({
    host:"redis",
    port:6379
});

// connect to redis server
// event listener for successful connection

redis.on("connect",()=>{
    console.log("connected to redis server");
});

// event listener for error
redis.on("error",(err)=>{
    console.log("redis error",err);
});

module.exports=redis;   