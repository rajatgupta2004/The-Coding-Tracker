const cheerio = require('cheerio');
const axios = require('axios');


const gfg = async (username) => {
    let $;
    try {
        // Fetch the profile page of the user from GFG
        const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}`, {
            headers: {
                redirect: 'manual'
            }
        });
        $ = cheerio.load(response.data);
    } catch (error) {
        return ({ status:"error",username ,data: 'Failed to fetch user data' });
    }

    // Extract the number of problems solved from GFG profile
    const problemsSolvedText = $('div.scoreCard_head__nxXR8:contains("Problem Solved")')
        .first()
        .find('.scoreCard_head_left--score__oSi_x')
        .text();

    const problemsSolved = parseInt(problemsSolvedText.trim(), 10);  // Parse the number of problems solved

    if (isNaN(problemsSolved)) {
        return ({status:"error",username , data: 'User not found or unable to fetch data' });
    } else {
        return ({status:"ok",username,data:{problems_solved: problemsSolved }});
    }
};

module.exports = gfg 
