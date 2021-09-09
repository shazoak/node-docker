const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    movie:{
        type:String,
        required:[true,"Movie must have movie name"]
    },
    fetched:{
        type:Object,
        required:[true,"Movie must have fetched information"]
    },
    sss:{
        type:String,
        required:[true,"Movie must have s3 link to the poster of the movie"]
    }
})

const Movie = mongoose.model("Movie",movieSchema);
module.exports = Movie;