const axios = require('axios'); // Import axios

async function codeforces(username) {
  if (!username || typeof username !== "string" || username.trim() === "") {
    return { status: "error", username, data: "Invalid username provided" };
  }
  let userdata = {
    maxRating: 0,
    maxRank: "Unrated",
    problemsSolved: 0,
  };

  try {
    // Fetch user info
    const userInfoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);

    // Check if API response is OK and valid
    if (userInfoResponse.data.status === "OK" && userInfoResponse.data.result.length > 0) {
      const userInfo = userInfoResponse.data.result[0];

      userdata.maxRating = userInfo.maxRating || 0;
      userdata.maxRank = userInfo.maxRank || "Unrated";
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { status: "error", username, data: "User not found or invalid username" };
    }
    return { status: "error", username, data: `Error fetching user info: ${error.message}` };
  }

  try {
    // Fetch user submissions to calculate unique problems solved
    const userStatusResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);

    if (userStatusResponse.data.status === "OK" && userStatusResponse.data.result.length > 0) {
      const submissions = userStatusResponse.data.result;
      // Use a Set to store unique problem IDs to avoid duplicates
      const solvedProblems = new Set();
      submissions.forEach((submission) => {
        if (submission.verdict === "OK" && submission.problem && submission.problem.contestId) {
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblems.add(problemId);
        }
      });
      userdata.problemsSolved = solvedProblems.size;
    } else {
      return { status: "ok", username, data: userdata };
    }
  } catch (error) {
    return { status: "error", username, data: `Error fetching user submissions: ${error.message}` };
  }

  // Return successful data
  return { status: "ok", username, data: userdata };
}

module.exports = codeforces;
