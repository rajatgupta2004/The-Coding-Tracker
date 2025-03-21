const cheerio = require('cheerio');
const axios = require('axios');

const codechef = async (username) => {
    let $;
    try {
        const response = await axios.get('https://www.codechef.com/users/' + username, {
            headers: {
                redirect: 'manual'
            }
        });
        $ = cheerio.load(response.data);
    } catch (error) {
        console.log(error);
        return ({ status:"error",username ,data: 'Failed to fetch user data' });
    }
    // Extract problems solved
    const problemsSolvedText = $('h3:contains("Total Problems Solved")').text();
    const problemsSolved = parseInt(problemsSolvedText.match(/\d+/)[0], 0);
    
    let userdata = {
        username: '',
        rating: $('.rating').first().text(),
        rating_number: parseInt($('.rating-number').text()),
        problems_solved: problemsSolved // Added problems solved count
    };
    // Extract user details
    $('.user-details li').each((i, item) => {
        if ($(item).find('label').text() == 'Username:') {
            userdata.username = $(item).find('span').last().text();
        }
    });

    if (!userdata.username) {
        return ({ status:"error",username ,data: 'User not found' });
    } else {
        return {status:"ok",username,data:userdata};
    }
};

module.exports = codechef ;