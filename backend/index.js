const express = require('express');
const { LeetCode } =require('leetcode-query');
const cors = require('cors');
const { User } = require('./db');
const { default: axios } = require('axios');
const reader = require('xlsx');
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());

let sampleData = [];

const leetcode = new LeetCode();
const spreadsheetId = process.env.SHEET_KEY;
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;



async function refreshStudentsData(){
  // Fetch the Google Sheets 
  axios.get(url, { responseType: 'arraybuffer' })
  .then(response => {
    // Convert response data into buffer
    const dataBuffer = Buffer.from(response.data);
    // Parse the Excel file
    const file = reader.read(dataBuffer);
    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[sheets[i]]);
      temp.forEach(res => {
        data.push(res);
      });
    }
    // Print data
    sampleData = data;
  }
  )


}


async function fetchData(){
    const sampleData= await User.find();
    const data = [];
    const promises = sampleData.map(async (user) => {
        const obj ={id:user.id, name:user.name, section:user.section,username:user.username};    
        try {
            const userstats = await leetcode.user(user.username);
            const temp= userstats.matchedUser.submitStats.acSubmissionNum;
            temp.map(tmp=>{
                obj[tmp.difficulty.toLowerCase()]=tmp.count
            })
            data.push(obj);
        } catch (error) {
            // console.error(`Error fetching data for ${user.username}:`, error);
        }

    });
    await Promise.all(promises); 
    return data
}

app.get('/data',async (req,res)=>{
    const data =await fetchData();
    res.json({
        data
    });
})
app.get('/addUser',async (req,res)=>{
    await refreshStudentsData();
    const allUser = [];
    const promises = sampleData.map(async (user)=>{
        const isUsername = await User.findOne({
            username:user.username
        })
        if(isUsername){
            // console.log(`${user.username} is already available in database`);
        }else{
            allUser.push(user);
        }
    })
    await Promise.all(promises); 
    // console.log(allUser);

    const result =await User.insertMany(allUser);
    res.json({
        message:allUser
    });
});

app.get('/',async(req,res)=>{
    await refreshStudentsData();
    res.send("hello");
})
app.listen(3000,()=>{
    console.log("app is listening on port 3000");
})

