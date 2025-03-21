const axios = require('axios');

const leetcode = async (username) => {
  // Validate the username
  if (!username || typeof username !== "string" || username.trim() === "") {
    return { status: "error", username, data: "Invalid username provided" };
  }

  // Define the GraphQL query for LeetCode API
  const query = `
    {
      matchedUser(username: "${username}") {
        username
        profile {
          userAvatar
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        badges {
          name
        }
        userCalendar {
          streak
          totalActiveDays
        }
      }
      userContestRanking(username: "${username}") {
        attendedContestsCount
        globalRanking
        rating
        topPercentage
        totalParticipants
      }
    }
  `;

  try {
    // Send POST request to LeetCode GraphQL API
    const response = await axios.post(
      'https://leetcode.com/graphql',
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if data is present and valid
    const data = response.data.data;

    if (!data || !data.matchedUser) {
      return { status: "error", username, data: "User not found or data unavailable" };
    }

    const userInfo = data.matchedUser;
    const contestInfo = data.userContestRanking || {};

    // Extract data from API response
    const userdata = {
      username: userInfo.username || "N/A",
      avatar: userInfo.profile?.userAvatar || "N/A",
      problems_solved: userInfo.submitStats?.acSubmissionNum || [],
      badges: userInfo.badges?.map((badge) => badge.name) || [],
      streak: userInfo.userCalendar?.streak || 0,
      total_active_days: userInfo.userCalendar?.totalActiveDays || 0,
      contest_attended: contestInfo.attendedContestsCount || 0,
      global_ranking: contestInfo.globalRanking || "N/A",
      rating: contestInfo.rating || "N/A",
      top_percentage: contestInfo.topPercentage || "N/A",
      total_participants: contestInfo.totalParticipants || "N/A",
    };

    // Return successful data
    return { status: "ok", username, data: userdata };
  } catch (error) {
    console.error("Error fetching LeetCode data:", error.message);
    return { status: "error", username, data: `Failed to fetch user data: ${error.message}` };
  }
};

module.exports = leetcode;
