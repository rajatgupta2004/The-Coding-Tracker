const axios = require('axios');

const leetcode = async (username) => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `{
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
      }`
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Return the data from the response
    return {status:"ok",username ,data:response.data.data.matchedUser.submitStats.acSubmissionNum};
  } catch (error) {
    // Return the error if the request fails
    return {status: "error", username ,data: error.message};
  }
};

module.exports = leetcode;