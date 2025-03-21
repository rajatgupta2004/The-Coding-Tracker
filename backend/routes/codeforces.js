const axios = require('axios'); // Import axios

async function codeforces(username) {
  let userdata = {};

  try {
    // Fetch user info
    const userInfoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    if (userInfoResponse.data.status === 'OK') {
      const userInfo = userInfoResponse.data.result[0];
      userdata.maxRating = userInfo.maxRating; // Add max rating
      userdata.maxRank = userInfo.maxRank; // Add max rank
    } else {
      throw new Error('User not found');
    }

    // Fetch user submissions to calculate the number of problems solved
    const userStatusResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
    if (userStatusResponse.data.status === 'OK') {
      const submissions = userStatusResponse.data.result;

      // Use a Set to store unique problem IDs (to avoid counting duplicates)
      const solvedProblems = new Set();

      submissions.forEach((submission) => {
        if (submission.verdict === 'OK') {
          // Problem is uniquely identified by contestId and problem index (e.g., "123A")
          const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
          solvedProblems.add(problemId);
        }
      });

      userdata.problemsSolved = solvedProblems.size; // Add number of problems solved
    } else {
      throw new Error('Failed to fetch user submissions');
    }

    return {status:"ok",username,data:userdata};
  } catch (error) {
    // Handle any errors that occur during the API calls
    return {status:"error",username , data: error.message };
  }
}


module.exports =  codeforces 
