const Movie = require("../models/movieModel")
const redis = require('redis')

const {REDIS_PORT,REDIS_URL,S3_ACCESS_KEY_ID,S3_ENDPOINT,S3_SECRET_ACCESS_KEY} = require("../config/config");
let redisClient = redis.createClient({
    host:REDIS_URL,
    port:REDIS_PORT
})

const isCachedInMongo =async (req,res,next)=>{
    console.log("   fetching from mongo ...")
    const {movie} = req.params;

    try {
        // find the movie placed in the req.params from mongodb.movies

        const fetch = await Movie.findOne({movie})

        // if there is a movie in mongo then return the info
        if(fetch){

            // cache the data to redis again

            await redisClient.setex(movie,60,JSON.stringify({
                movie,
                data:fetch.fetched,
                s3Key:fetch.sss
            }));

            return res.status(200).send({status:"success",data:fetch})
        }else{
            // else call next() for fetching the movie from the movieDB api
            next();
        }
    }catch (e) {
        console.log(e);
        return res.status(500).send({status:"fail",message:"mongo Error"})
    }
}

module.exports = isCachedInMongo;