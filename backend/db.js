const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("db connected successfully");
    })
    .catch(()=>{
        console.log("Error occured in connecting database");
    })
    // { id: 1, name: 'Rajat gupta', section: 'A', username: 'rajatgupta05', easy: 45, medium: 32, hard: 15, total: 92 },
const userSchema =new mongoose.Schema({
    name:String,
    username:String,
    section:String,
    roll:String
});
const User = mongoose.model('User',userSchema);
module.exports= {User};