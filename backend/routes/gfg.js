const cheerio = require('cheerio');
const axios = require('axios');

const gfg = async (username) => {
    // Validate the username
    if (!username || typeof username !== "string" || username.trim() === "") {
        return { status: "error", username, data: "Invalid username provided" };
    }

    let $;
    const url = `https://auth.geeksforgeeks.org/user/${username}`;

    try {
        // Fetch the user's profile page
        const response = await axios.get(url, {
            headers: {
                redirect: 'manual', // Handle redirects manually
            },
        });

        // Check if the page exists by inspecting status code or page title
        if (response.status !== 200 || response.data.includes("Page Not Found")) {
            return { status: "error", username, data: "User not found" };
        }

        // Load the HTML content into cheerio
        $ = cheerio.load(response.data);
    } catch (error) {
        console.error("Error fetching GFG data:", error.message);
        return { status: "error", username, data: "Failed to fetch user data" };
    }

    // Extract problems solved - Update selector to account for structure changes
    let problemsSolvedText = $('div[class*="scoreCard_head__"]:contains("Problem Solved")')
        .first()
        .next('div')
        .text()
        .trim();

    // Parse problems solved and validate
    const problemsSolved = problemsSolvedText ? parseInt(problemsSolvedText.replace(/\D/g, ""), 10) : NaN;

    // Handle invalid or missing problems solved count
    if (isNaN(problemsSolved) || problemsSolved === 0) {
        return { status: "error", username, data: "User not found or unable to fetch data" };
    } else {
        // Return successful data
        return {
            status: "ok",
            username,
            data: {
                problems_solved: problemsSolved,
            },
        };
    }
};

module.exports = gfg;
