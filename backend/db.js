const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("db connected successfully");
    })
    .catch(() => {
        console.log("Error occured in connecting database");
    })

const historySchema = new mongoose.Schema({
    year: String, 
    month:String,
    lcTotal: Number,
    cfTotal: Number,
    ccTotal: Number,
    ggTotal: Number,
    Total: Number,
    lcEasy:Number,
    lcMedium:Number,
    lcHard:Number,
    cfRating: Number,
    ccRating: Number,
    cfRank: String,
    ccRank: String,
});

const userSchema = new mongoose.Schema({
    name: String,
    roll: String,
    section: String,
    gmail: String,
    phone: String,
    passingYear: String,
    branch: String,
    lcUsername: String,
    cfUsername: String,
    ccUsername: String,
    ggUsername: String,
    lcEasy: Number,
    lcMedium: Number,
    lcHard: Number,
    lcTotal: Number,
    cfTotal: Number,
    ccTotal: Number,
    ggTotal: Number,
    cfRating: Number,
    cfRank: String,
    ccRating: Number,
    ccRank: String,
    Total: Number,
    history: [historySchema],
});

const User = mongoose.model('User', userSchema);
module.exports = { User };