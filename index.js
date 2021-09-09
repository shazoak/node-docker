const express = require('express');
const mongoose = require('mongoose');
const {SESSION_SECRET,REDIS_PORT,REDIS_URL,MONGO_IP,MONGO_PASSWORD,MONGO_PORT,MONGO_USER} = require("./config/config");
const userRouter = require("./routes/userRoutes")
const movieRouter = require("./routes/movieRoutes")
const cors = require('cors')
const redis = require('redis')
const session = require('express-session')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host:REDIS_URL,
    port:REDIS_PORT
})


const app = express();


const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = ()=>{
    mongoose
        .connect(mongoURL)
        .then(() => {console.log("mongodb connected ok")})
        .catch((e)=>{
            console.log(e);
            setTimeout(connectWithRetry,5000)
        })

}

connectWithRetry();

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie:{
            secure:false,
            resave:false,
            saveUninitialized: false,
            httpOnly:true,
            maxAge:60000

        }
    })
)
app.use(express.json());
app.use(cors());

// app.get("/",(req,res)=>{
//     res.send("haasdadsdad    sdasdsdasdasdasdasda  ")
// })


//localhost:3000/api/v1/
app.use("/api/v1/users",userRouter)
app.use("/api/v1/movies",movieRouter)

const PORT = process.env.PORT || 3000 ;

app.listen(PORT , ()=>{
    console.log(`server started on port ${PORT}`)
});

module.exports = app;
