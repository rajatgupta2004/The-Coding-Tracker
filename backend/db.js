const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("db connected successfully");
    })
    .catch(()=>{
        console.log("Error occured in connecting database");
    })
    // { id: 1, name: 'Rajat gupta', section: 'A', username: 'rajatgupta05', easy: 45, medium: 32, hard: 15, total: 92 },
const userSchema =new mongoose.Schema({
    name:String,
    lcUsername:String,
    cfUsername:String,
    ccUsername:String,
    ggUsername:String,
    section:String,
    roll:String,
    lcEasy:Number,
    lcMedium:Number,
    lcHard:Number,
    lcTotal:Number,
    cfTotal:Number,
    ccTotal:Number,
    ggTotal:Number,
    cfRating:Number,
    cfRank:String,
    ccRating:Number,
    ccRank:String,
    
});
const User = mongoose.model('User',userSchema);
module.exports= {User};