const cheerio = require('cheerio');
const axios = require('axios');

const codechef = async (username) => {
    // Input validation
    if (!username || typeof username !== 'string' || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        return {
            status: "error",
            username,
            data: "Invalid username format"
        };
    }

    let $;
    try {
        const response = await axios.get(`https://www.codechef.com/users/${encodeURIComponent(username)}`, {
            headers: {
                redirect: 'manual'
            },
            timeout: 10000, // 10 seconds timeout
            validateStatus: (status) => status < 500 // Accept any status < 500
        });

        // Handle redirects or non-200 status codes
        if (response.status !== 200) {
            return {
                status: "error",
                username,
                data: response.status === 404 ? "User not found" : `Request failed with status ${response.status}`
            };
        }

        $ = cheerio.load(response.data);

        // Check if user exists by looking for the username in the page
        const usernameElement = $('.user-details-container .user-details li').filter((i, item) => {
            return $(item).find('label').text().trim() === 'Username:';
        });

        if (!usernameElement.length) {
            return {
                status: "error",
                username,
                message: "User not found"
            };
        }

        // Extract problems solved with better error handling
        const problemsSolvedElement = $('h3:contains("Total Problems Solved")');
        let problemsSolved = 0;
        
        if (problemsSolvedElement.length) {
            const problemsText = problemsSolvedElement.text();
            const match = problemsText.match(/\d+/);
            problemsSolved = match ? parseInt(match[0], 10) : 0;
        }

        // Extract user details
        const userdata = {
            username: usernameElement.find('span').last().text().trim(),
            rating: $('.rating').first().text().trim(),
            rating_number: parseInt($('.rating-number').text().trim(), 10) || 0,
            problems_solved: problemsSolved
        };

        // Final validation of extracted data
        if (!userdata.username || isNaN(userdata.rating_number)) {
            return {
                status: "error",
                username,
                data: "Failed to parse user data"
            };
        }

        return {
            status: "ok",
            username,
            data: userdata
        };

    } catch (error) {
        // Handle different error types
        let errorMessage = "Unknown error occurred";
        
        if (error.response) {
            errorMessage = `Request failed with status ${error.response.status}`;
        } else if (error.request) {
            errorMessage = "No response received from server";
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = "Request timed out";
        } else {
            errorMessage = error.message || "Network error";
        }

        return {
            status: "error",
            username,
            data: errorMessage
        };
    }
};

module.exports = codechef;