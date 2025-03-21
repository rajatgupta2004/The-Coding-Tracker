const cheerio = require('cheerio');
const axios = require('axios');

const codechef = async (username) => {
    if (!username || typeof username !== "string" || username.trim() === "") {
        return { status: "error", username, data: "Invalid username provided" };
    }

    const url = `https://www.codechef.com/users/${username}`;

    try {
        // Send request to CodeChef user profile page
        const response = await axios.get(url, {
            headers: {
                redirect: 'manual',
            },
        });

        if (response.status !== 200) {
            return { status: "error", username, data: "User not found or invalid URL" };
        }

        // Load HTML content using cheerio
        const $ = cheerio.load(response.data);

        // Check if user profile exists
        if ($('title').text().includes("Page Not Found")) {
            return { status: "error", username, data: "User not found" };
        }

        // Extract user details
        let userdata = {
            username: username,
            rating: '',
            rating_number: 0,
            problems_solved: 0,
        };

        // Get rating (handle missing data gracefully)
        const ratingText = $('.rating').first().text().trim();
        userdata.rating = ratingText || "Unrated";

        // Get rating number (check if numeric value is present)
        const ratingNumberText = $('.rating-number').text().trim();
        userdata.rating_number = ratingNumberText ? parseInt(ratingNumberText, 10) : 0;

        // Extract total problems solved
        const problemsSolvedText = $('h5:contains("Problems Solved")')
            .next()
            .text()
            .trim();

        userdata.problems_solved = problemsSolvedText
            ? parseInt(problemsSolvedText.match(/\d+/)?.[0] || "0", 10)
            : 0;

        // Get username from profile (extra validation)
        $('.user-details li').each((i, item) => {
            if ($(item).find('label').text().trim() === 'Username:') {
                userdata.username = $(item).find('span').last().text().trim();
            }
        });

        // If username is still empty after scraping
        if (!userdata.username) {
            return { status: "error", username, data: "User not found or profile is private" };
        }

        // Return successful data
        return { status: "ok", username, data: userdata };

    } catch (error) {
        console.error("Error fetching user data:", error.message);
        return { status: "error", username, data: "Failed to fetch user data" };
    }
};

module.exports = codechef;
