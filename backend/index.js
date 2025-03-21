const express = require('express');
const axios = require('axios');
const cors = require('cors');
const reader = require('xlsx');
const cheerio = require('cheerio');

const { User } = require('./db');
const codeforces = require('./routes/codeforces');
const codechef = require('./routes/codechef');
const gfg = require('./routes/gfg');
const leetcode = require('./routes/leetcode');

const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());


const spreadsheetId = process.env.SpreadSheet_ID;
const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;

async function refreshStudentsData() {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const dataBuffer = Buffer.from(response.data);
    const file = reader.read(dataBuffer);
    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[sheets[i]]);
      temp.forEach(res => {
        data.push(res);
      });
    }
    return data;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/adduser', async (req, res) => {
    const sampleData = await refreshStudentsData();
    const allUser = [];
    
    // Using a standard for loop to await each promise one after another
    for (const user of sampleData) {
        const isUsername = await User.findOne({ lcUsername: user.lcUsername,cfUsername: user.cfUsername,ccUsername: user.ccUsername,ggUsername: user.ggUsername });
        if (!isUsername) {
            const ggRes = await gfg(user.ggUsername);
            const ccRes = await codechef(user.ccUsername);
            const cfRes = await codeforces(user.cfUsername);
            const lcRes = await leetcode(user.lcUsername);
            let lcTotal =0, lcEasy =0,lcMedium =0,lcHard =0;
            let cfTotal =0,cfRating =0,cfRank = "";
            let ccTotal =0,ccRating =0,ccRank = "";
            let ggTotal =0;
            
            if(lcRes.status ==='ok'){
                lcTotal = lcRes.data[0].count;
                lcEasy = lcRes.data[1].count;
                lcMedium = lcRes.data[2].count;
                lcHard = lcRes.data[3].count;
            }
            if(cfRes.status ==='ok'){
                cfTotal = cfRes.data.problemsSolved;
                cfRating = cfRes.data.maxRating;
                cfRank = cfRes.data.maxRank;
            }

            if(ccRes.status ==='ok'){
                ccTotal = ccRes.data.problems_solved;
                ccRating = ccRes.data.rating_number;
                ccRank = ccRes.data.rating;
            }

            if(ggRes.status ==='ok'){
                ggTotal = ggRes.data.problems_solved;
            }
            
            allUser.push({
                name: user.name,
                section: user.section,
                roll: user.roll,
                lcUsername: user.lcUsername,
                cfUsername: user.cfUsername,
                ccUsername: user.ccUsername,
                ggUsername: user.ggUsername,
                lcTotal:lcTotal,
                lcEasy:lcEasy,
                lcMedium:lcMedium,
                lcHard:lcHard,
                ggTotal:ggTotal,
                cfTotal:cfTotal,
                cfRating:cfRating,
                cfRank:cfRank,
                ccTotal:ccTotal,
                ccRating:ccRating,
                ccRank:ccRank,
            });
            await delay(5);
        }
    }
    // Insert only after all the users are gathered
    if (allUser.length > 0) {
        const result = await User.insertMany(allUser);
        res.json({
            message: result
        });
    } else {
        res.json({
            message: 'No new users to add.'
        });
    }
});

app.get('/',async(req,res)=>{
    res.send("hello");
})

app.get('/codeforces/:username',async (req,res)=>{
    const username = req.params.username;
    const result = await codeforces(username);
    res.send(result);
})
app.get('/leetcode/:username',async (req,res)=>{
    const username = req.params.username;
    const result = await leetcode(username);
    res.send(result);
})
app.get('/gfg/:username',async (req,res)=>{
    const username = req.params.username;
    const result = await gfg(username);
    res.send(result);
})
app.get('/codechef/:username',async (req,res)=>{
    const username = req.params.username;
    const result = await codechef(username);
    res.send(result);
})


app.get('/data',async (req,res)=>{
    const data = await User.find();
    res.json({
        data
    });
})

app.get("/refreshdatabase", async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        // Loop through each user and update their data
        for (const user of users) {
            try {
                // Fetch updated data from each platform
                const ggRes = await gfg(user.ggUsername);
                const ccRes = await codechef(user.ccUsername);
                const cfRes = await codeforces(user.cfUsername);
                const lcRes = await leetcode(user.lcUsername);

                // Initialize variables to store updated data
                let lcTotal = user.lcTotal;
                let lcEasy = user.lcEasy;
                let lcMedium = user.lcMedium;
                let lcHard = user.lcHard;
                let cfTotal = user.cfTotal;
                let cfRating = user.cfRating;
                let cfRank = user.cfRank;
                let ccTotal = user.ccTotal;
                let ccRating = user.ccRating;
                let ccRank = user.ccRank;
                let ggTotal = user.ggTotal;

                // Update LeetCode data
                if (lcRes.status === 'ok') {
                    lcTotal = lcRes.data[0].count;
                    lcEasy = lcRes.data[1].count;
                    lcMedium = lcRes.data[2].count;
                    lcHard = lcRes.data[3].count;
                }

                // Update Codeforces data
                if (cfRes.status === 'ok') {
                    cfTotal = cfRes.data.problemsSolved;
                    cfRating = cfRes.data.maxRating;
                    cfRank = cfRes.data.maxRank;
                }

                // Update CodeChef data
                if (ccRes.status === 'ok') {
                    ccTotal = ccRes.data.problems_solved;
                    ccRating = ccRes.data.rating_number;
                    ccRank = ccRes.data.rating;
                }

                // Update GeeksforGeeks data
                if (ggRes.status === 'ok') {
                    ggTotal = ggRes.data.problems_solved;
                }

                // Update the user's record in the database
                await User.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            lcTotal: lcTotal,
                            lcEasy: lcEasy,
                            lcMedium: lcMedium,
                            lcHard: lcHard,
                            cfTotal: cfTotal,
                            cfRating: cfRating,
                            cfRank: cfRank,
                            ccTotal: ccTotal,
                            ccRating: ccRating,
                            ccRank: ccRank,
                            ggTotal: ggTotal,
                        },
                    }
                );

                console.log(`Updated data for user: ${user.name}`);
                await delay(1000); // Add a delay to avoid rate limits
            } catch (error) {
                console.error(`Error updating data for user ${user.name}:`, error);
            }
        }

        res.json({ message: "Database refreshed successfully" });
    } catch (error) {
        console.error('Error refreshing database:', error);
        res.status(500).send({ error: 'Failed to refresh database' });
    }
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});