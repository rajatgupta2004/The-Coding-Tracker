import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const HowItWorks: React.FC = () => {
  return (
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <div className='flex justify-center'>
        <h1 className="text-4xl w-fit font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          How It Works
        </h1>
        <h1 className='text-4xl'>🚀</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Data Collection Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <CodeIcon className="text-blue-400 text-3xl" />
            <h2 className="text-2xl font-semibold">Data Collection</h2>
          </div>
          <p className="text-gray-300 mb-4">
            Our system automatically collects coding activity from multiple platforms:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <img
                src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png"
                className="w-5 h-5"
                alt="LeetCode"
              />
              <span>LeetCode problems solved</span>
            </li>
            <li className="flex items-center gap-2">
              <img
                src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-shadow-tal-revivo.png"
                className="w-5 h-5"
                alt="Codeforces"
              />
              <span>Codeforces ratings & contests</span>
            </li>
            <li className="flex items-center gap-2">
              <img
                src="https://cdn.codechef.com/images/cc-logo.svg"
                className="w-5 h-5"
                alt="CodeChef"
              />
              <span>CodeChef rankings</span>
            </li>
            <li className="flex items-center gap-2">
              <img
                src="https://img.icons8.com/?size=100&id=AbQBhN9v62Ob&format=png&color=000000"
                className="w-5 h-5"
                alt="GeeksforGeeks"
              />
              <span>GeeksforGeeks solutions</span>
            </li>
          </ul>
        </div>

        {/* Leaderboard Features Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <LeaderboardIcon className="text-purple-400 text-3xl" />
            <h2 className="text-2xl font-semibold">Leaderboard Features</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <RefreshIcon className="text-indigo-400 mt-1" />
              <div>
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-gray-300">
                  Data updates automatically every 24 hours. Manual refresh available:
                  <IconButton className="!text-indigo-400 !ml-2">
                    <RefreshIcon />
                  </IconButton>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SchoolIcon className="text-green-400 mt-1" />
              <div>
                <h3 className="font-semibold">Section Filtering</h3>
                <p className="text-gray-300">
                  Filter students by academic section using the dropdown selector
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 12a1 1 0 102 0V4a1 1 0 00-2 0v8zm5-4a1 1 0 10-2 0v4a1 1 0 102 0V8zm5 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" />
                <path fillRule="evenodd" d="M1 12a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0 1 1 0 11-2 0zm14.95-4.535a1 1 0 00-.707-.707l-1.414 1.414a1 1 0 101.414 1.414l1.414-1.414a1 1 0 00-.707-1.707z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold">Smart Sorting</h3>
                <p className="text-gray-300">
                  Click column headers to sort by:
                  <span className="ml-2 text-indigo-400">Total Problems ↗</span>
                  <span className="mx-2 text-green-400">Easy ↗</span>
                  <span className="text-yellow-400">Medium ↗</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-12">
        <h2 className="text-2xl font-semibold mb-4">📖 User Guide</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-indigo-400">Searching</h3>
            <p className="text-gray-300">
              Use the search bar to find specific students by name. Matches partial names and is case-insensitive.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-green-400">Profile Links</h3>
            <p className="text-gray-300">
              Click on any platform's problem count to visit the student's profile on that platform.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-yellow-400">Rank Colors</h3>
            <p className="text-gray-300">
              Names are colored based on Codeforces rankings:
              <span className="ml-2 text-gray-400">Newbie</span>
              <span className="mx-2 text-green-400">Pupil</span>
              <span className="text-blue-400">Expert+</span>
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-400">Total Score</h3>
            <p className="text-gray-300">
              Final column shows combined score across all platforms. Updated in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="text-center border-t border-gray-700 pt-6">
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          View Live Leaderboard →
        </Link>
        <p className="mt-4 text-gray-400 text-sm">
          Built with React, TypeScript, and ❤️ | Data updates every 24 hours
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;