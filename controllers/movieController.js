const axios = require('axios');
const Movie = require("../models/movieModel");
const download = require('image-downloader');
const path = require('path');
const fs = require('fs')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const redis = require('redis')

const {REDIS_PORT,REDIS_URL,S3_ACCESS_KEY_ID,S3_ENDPOINT,S3_SECRET_ACCESS_KEY} = require("../config/config");

const s3 = new S3Client({
    region: 'default',
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
    }
});
let redisClient = redis.createClient({
    host:REDIS_URL,
    port:REDIS_PORT
})



exports.getMovieByTitle = async ( req , res , next) =>{

    let movie = req.params.movie
    console.log("       fetching from api ...")
    const omdbURL = `http://www.omdbapi.com/?t=${movie}&apikey=80714459`

    try{

        //fetch movie from  http://www.omdbapi.com/?t=avengers&apikey=80714459

        const fetchedMovie =await axios.get(omdbURL)
            .catch((e)=>{

            })
        // console.log(fetchedMovie.data)

        if(fetchedMovie.data.Response ==='False'){
            return res.status(200).json({
                status: 'fail',
                // result: posts.length,
                data:fetchedMovie.data
            })
        }

        //download the poster

        const options = {
            url: fetchedMovie.data.Poster,
            dest: './uploads'
        }
        let image = await download.image(options)
            // .then(({ filename }) => {
            //     console.log('Saved to', filename)
            // })
            .catch((err) => console.error(err))

        const {filename} = image;

        console.log(filename)

        // then save the poster to the s3 bucket

        const uploadParams = {
            Bucket: 'mytestapp', // bucket name
            Key: 'object-name', // the name of the selected file
            ACL: 'public-read',  // 'private' | 'public-read'
            Body: 'BODY'
        };
        const runUpload = async () => {

            // Configure the file stream and obtain the upload parameters
            const fileStream = fs.createReadStream(filename);
            fileStream.on('error', function (err) {
                console.log('File Error', err);
            });
            uploadParams.Key = path.basename(filename);

            // call S3 to upload file to specified bucket

            uploadParams.Body = fileStream;
            try {
                const data = await s3.send(new PutObjectCommand(uploadParams));
                console.log('Success s3');
            } catch (err) {
                console.log('Error', err);
            }
        };
        await runUpload();

        //save all the created data to mongoDb
        const mongoMovie = await Movie.create({
            movie,fetched:fetchedMovie.data,sss:uploadParams.Key
        })

        //save all the data to the redis
        await redisClient.setex(movie,60,JSON.stringify({
            movie,
            data:fetchedMovie.data,
            s3Key:uploadParams.Key
        }));

        //return all the data via response
        return res.status(200).json({
            status: 'success',
            movie,
            data:fetchedMovie.data,
            s3Key:uploadParams.Key
        })


    }catch (e){
        console.log(e);
        res.status(500).json({
            status:"fail"
        })
    }
}