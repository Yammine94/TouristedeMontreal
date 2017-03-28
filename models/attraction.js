var mongoose = require("mongoose");

var attractionSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    location: String,
    lat: Number,
    lng: Number
});

module.exports = mongoose.model("Attraction", attractionSchema);