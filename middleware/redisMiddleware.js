const redis = require('redis')
const {REDIS_PORT,REDIS_URL} = require("../config/config");

let redisClient = redis.createClient({
    host:REDIS_URL,
    port:REDIS_PORT
})
const isCachedInRedis = async (req,res,next)=>{
    console.log("fetching from redis ...")
    const {movie} = req.params;

    // find the movie placed in the req.params from redis.movies
    if(!movie){
        return res.status(400).json({
            status:"fail",
            message:"reject Empty movie name"
        })
    }

    await redisClient.get(movie,(err,data)=>{
        if(err) throw err;

        // if there is a movie in redis then return the info
        if(data !==null){
            return res.send(JSON.parse(data))
        }else{
        // else call next() for fetching the movie from the mongoDb.movies
            next();
        }
    })



}

module.exports = isCachedInRedis;