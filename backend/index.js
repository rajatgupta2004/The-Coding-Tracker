const express = require('express');
const axios = require('axios');
const cors = require('cors');
const reader = require('xlsx');
const cron = require('node-cron');

const { User } = require('./db');
const codeforces = require('./routes/codeforces');
const codechef = require('./routes/codechef');
const gfg = require('./routes/gfg');
const leetcode = require('./routes/leetcode');

const app = express();

require('dotenv').config()
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

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


const addUsersFromExcel = async () => {
    console.log('🚀 Adding new users from Excel...');
    const sampleData = await refreshStudentsData(); // Fetch Excel data
    const allUser = [];
    for (const user of sampleData) {
      try {
        // Check if the user already exists
        const isUsername = await User.findOne({
          lcUsername: user.lcUsername.trim(),
          cfUsername: user.cfUsername.trim(),
          ccUsername: user.ccUsername.trim(),
          ggUsername: user.ggUsername.trim(),
        });
  
        if (!isUsername) {
          // Fetch user data from different platforms
          const ggRes = await gfg(user.ggUsername.trim());
          const ccRes = await codechef(user.ccUsername.trim());
          const cfRes = await codeforces(user.cfUsername.trim());
          const lcRes = await leetcode(user.lcUsername.trim());
  
          // Initialize variables
          let lcTotal = 0, lcEasy = 0, lcMedium = 0, lcHard = 0;
          let cfTotal = 0, cfRating = 0, cfRank = '';
          let ccTotal = 0, ccRating = 0, ccRank = '';
          let ggTotal = 0;
  
          // LeetCode Data
          if (lcRes.status === 'ok') {
            lcTotal = lcRes.data.problems_solved[0].count;
            lcEasy = lcRes.data.problems_solved[1].count;
            lcMedium = lcRes.data.problems_solved[2].count;
            lcHard = lcRes.data.problems_solved[3].count;
          } else {
            lcTotal = -1;
            lcEasy = -1;
            lcMedium = -1;
            lcHard = -1;
          }
  
          // Codeforces Data
          if (cfRes.status === 'ok') {
            cfTotal = cfRes.data.problemsSolved;
            cfRating = cfRes.data.maxRating;
            cfRank = cfRes.data.maxRank;
          } else {
            cfTotal = -1;
          }
  
          // CodeChef Data
          if (ccRes.status === 'ok') {
            ccTotal = ccRes.data.problems_solved;
            ccRating = ccRes.data.rating_number;
            ccRank = ccRes.data.rating;
          } else {
            ccTotal = -1;
          }
  
          // GFG Data
          if (ggRes.status === 'ok') {
            ggTotal = ggRes.data.problems_solved;
          } else {
            ggTotal = -1;
          }
  
          // Push user data for insertion
          allUser.push({
            name: user.name.trim(),
            roll: user.roll,
            gmail: user.gmail.trim(),
            phone: user.phone,
            passingYear: user.passingYear,
            branch: user.branch.trim(),
            section: user.section.trim(),
            lcUsername: user.lcUsername.trim(),
            cfUsername: user.cfUsername.trim(),
            ccUsername: user.ccUsername.trim(),
            ggUsername: user.ggUsername.trim(),
            lcTotal,
            lcEasy,
            lcMedium,
            lcHard,
            ggTotal,
            cfTotal,
            cfRating,
            cfRank,
            ccTotal,
            ccRating,
            ccRank,
            Total: lcTotal + cfTotal + ccTotal + ggTotal,
          });
  
          await delay(5); // Add slight delay to avoid rate limits
        }
      } catch (error) {
        console.error(`❌ Error adding user ${user.name.trim()}:`, error);
      }
    }
  
    // Insert all gathered users into the database
    if (allUser.length > 0) {
      const result = await User.insertMany(allUser);
      console.log(`✅ ${result.length} new users added successfully.`);
      return { message: `${result.length} new users added.` };
    } else {
      console.log('⚠️ No new users to add.');
      return { message: 'No new users to add.' };
    }
  };

  app.get('/adduser', async (req, res) => {
    try {
      const result = await addUsersFromExcel();
      res.json(result);
    } catch (error) {
      console.error('❌ Error adding users:', error);
      res.status(500).json({ error: 'Failed to add users' });
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

// Function to refresh database (can be called manually or via timer)
const refreshDatabase = async () => {
  try {
    console.log('Starting database refresh...');
    const users = await User.find(); // Fetch all users

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

        // LeetCode data
        if (lcRes.status === 'ok') {
          lcTotal = lcRes.data.problems_solved[0].count;
          lcEasy = lcRes.data.problems_solved[1].count;
          lcMedium = lcRes.data.problems_solved[2].count;
          lcHard = lcRes.data.problems_solved[3].count;
        }

        // Codeforces data
        if (cfRes.status === 'ok') {
          cfTotal = cfRes.data.problemsSolved;
          cfRating = cfRes.data.maxRating;
          cfRank = cfRes.data.maxRank;
        }

        // CodeChef data
        if (ccRes.status === 'ok') {
          ccTotal = ccRes.data.problems_solved;
          ccRating = ccRes.data.rating_number;
          ccRank = ccRes.data.rating;
        }

        // GFG data
        if (ggRes.status === 'ok') {
          ggTotal = ggRes.data.problems_solved;
        }

        // Update the user's record in the database
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              lcTotal,
              lcEasy,
              lcMedium,
              lcHard,
              cfTotal,
              cfRating,
              cfRank,
              ccTotal,
              ccRating,
              ccRank,
              ggTotal,
              Total:lcTotal+cfTotal+ggTotal+ccTotal,
            },
          }
        );
        console.log(`✅ Updated data for user: ${user.name}`);
        await delay(1000); // Add a delay to avoid rate limits
      } catch (error) {
        console.error(`❌ Error updating data for user ${user.name}:`, error);
      }
    }

    console.log('🎉 Database refresh completed successfully!');
  } catch (error) {
    console.error('❗ Error refreshing database:', error);
    throw new Error('Failed to refresh database');
  }
};


app.get("/refreshdatabase", async (req, res) => {
    try {
        await refreshDatabase();
        res.json({ message: "Database refreshed successfully" });
    } catch (error) {
        console.error('Error refreshing database:', error);
        res.status(500).send({ error: 'Failed to refresh database' });
    }
});


// Schedule to run at 00:00 on 1st of every month
cron.schedule('0 0 1 * *', async () => {
    console.log('Running snapshot on the 1st day of every month at 12:00 AM...');
    const users = await User.find({});
    
    for (const user of users) {
        const snapshot = {
            year: new Date().toISOString().slice(0, 4), // Extract year
            month: new Date().toISOString().slice(5, 7), // Extract month
        lcTotal: user.lcTotal,
        lcEasy: user.lcEasy,
        lcMedium: user.lcMedium,
        lcHard: user.lcHard,
        cfTotal: user.cfTotal,
        ccTotal: user.ccTotal,
        ggTotal: user.ggTotal,
        Total: user.Total,
        cfRating: user.cfRating,
        ccRating: user.ccRating,
        cfRank: user.cfRank,
        ccRank: user.ccRank,
    };
    
    user.history.push(snapshot);
    await user.save();
}
console.log('Snapshots saved successfully on the 1st of every month!');
});


// Run refreshDatabase every day at 2 AM
cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Running database refresh at 2 AM...');
    await addUsersFromExcel();
    await refreshDatabase();
});



// app.get('/generatehistory', async (req, res) => {
    //     try {
        //       const users = await User.find({});
        //       for (const user of users) {
            //         const currentMonth = new Date().getMonth() + 2; // Get current month (1-12)
            //         // Clear previous history to avoid duplication
            //         user.history = [];
            //         // Generate history for the last 3 months with decreasing counts
            //         for (let i = 3; i >= 1; i--) {
                //           const month = (currentMonth - i) <= 0 ? 12 + (currentMonth - i) : (currentMonth - i); // Handle wrap around to previous year
                //           const year = month > currentMonth ? new Date().getFullYear() - 1 : new Date().getFullYear();
                
                //           // Apply a decrease in problems for each past month (10% decrease each month for demo)
                //           const decreaseFactor = 1 - (i * 0.1); // 10% decrease per month
                //           const snapshot = {
                    //             year: `${year}`,
                    //             month: `${month}`,
                    //             lcTotal: Math.max(0, Math.floor(user.lcTotal * decreaseFactor)),
                    //             lcEasy: Math.max(0, Math.floor(user.lcEasy * decreaseFactor)),
                    //             lcMedium: Math.max(0, Math.floor(user.lcMedium * decreaseFactor)),
                    //             lcHard: Math.max(0, Math.floor(user.lcHard * decreaseFactor)),
                    //             cfTotal: Math.max(0, Math.floor(user.cfTotal * decreaseFactor)),
                    //             ccTotal: Math.max(0, Math.floor(user.ccTotal * decreaseFactor)),
                    //             ggTotal: Math.max(0, Math.floor(user.ggTotal * decreaseFactor)),
                    //             Total: Math.max(0, Math.floor(user.Total * decreaseFactor)),
                    //             cfRating: user.cfRating,
                    //             ccRating: user.ccRating,
//             cfRank: user.cfRank,
//             ccRank: user.ccRank,
//           };

//           // Add generated history
//           user.history.push(snapshot);
//         }
//         // Save updated user with new history
//         await user.save();
//         console.log(`History updated for ${user.name}`);
//       }

//       res.json({ message: 'History for past 3 months generated successfully!' });
//     } catch (error) {
    //       console.error('Error generating history:', error);
    //       res.status(500).send({ error: 'Failed to generate history' });
    //     }
    //   });
    
app.listen(PORT, () => {
    console.log("App is listening on port "+PORT);
});
module.exports = app;
