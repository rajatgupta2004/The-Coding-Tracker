import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const URL = "https://leetcode-tracker-1-ucio.onrender.com";

interface LcUserData {
  _id: string;
  name: string;
  lcUsername: string;
  cfUsername: string;
  ccUsername: string;
  ggUsername: string;
  section: string;
  roll: string;
  lcEasy: number;
  lcMedium: number;
  lcHard: number;
  lcTotal: number;
  cfTotal: number;
  ccTotal: number;
  ggTotal: number;
  cfRating: number;
  cfRank: string;
  ccRating: number;
  ccRank: string;
}
const rankColors: { [key: string]: string } = {
    newbie: 'text-gray-400',
    pupil: 'text-green-400',
    specialist: 'text-cyan-400',
    expert: 'text-blue-400',
    'candidate master': 'text-purple-400',
    master: 'text-orange-400',
    'international master': 'text-orange-500',
    grandmaster: 'text-red-500',
    'international grandmaster': 'text-red-600',
    'legendary grandmaster': 'text-red-700',
  };

const platformImages:{[key:string]:string}={
    'LeetCode':"https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png",
    'Codeforces':"https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-shadow-tal-revivo.png", 
    'CodeChef':"https://cdn.codechef.com/images/cc-logo.svg", 
    'GFG':"https://img.icons8.com/?size=100&id=AbQBhN9v62Ob&format=png&color=000000",
}
  
const LeaderBoard: React.FC = () => {
  const [sortKey, setSortKey] = useState<keyof LcUserData>('lcTotal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadMessage, setReloadMessage] = useState('');
  const [sampleData, setSampleData] = useState<LcUserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(URL+'/data');
        setSampleData(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReloadDatabase = async () => {
    setIsReloading(true);
    setReloadMessage('');
    try {
      await axios.get(URL+'/adduser');
      await axios.get(URL+'/refreshdatabase');
      const res = await axios.get(URL+'/data');
      setSampleData(res.data.data);
      setReloadMessage('Database updated successfully!');
      setTimeout(() => setReloadMessage(''), 3000);
    } catch (error) {
      setReloadMessage('Error updating database');
      setTimeout(() => setReloadMessage(''), 3000);
    } finally {
      setIsReloading(false);
    }
  };

  const handleSort = (key: keyof LcUserData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sections = ['All', ...Array.from(new Set(sampleData?.map(item => item.section)))];

  const filteredAndSortedData = [...sampleData]
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      }
      return a[sortKey] < b[sortKey] ? 1 : -1;
    })
    .filter(
      user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedSection === 'All' || user.section === selectedSection)
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-100">
        <Box sx={{ display: 'flex' }}>
          <CircularProgress sx={{ color: '#4f46e5' }} />
        </Box>
      </div>
    );
  }

  return (
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl w-full text-center font-bold mb-4 md:mb-0 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <div className="flex items-center gap-4">
          <IconButton
            onClick={handleReloadDatabase}
            disabled={isReloading}
            className="!text-indigo-400 hover:!bg-indigo-900/30 !rounded-lg !p-2 !transition-all"
            title="Refresh database"
          >
            {isReloading ? (
              <CircularProgress size={24} className="!text-indigo-400" />
            ) : (
              <RefreshIcon className="text-2xl" />
            )}
          </IconButton>
          {reloadMessage && (
            <span
              className={`px-4 py-2 rounded-lg ${
                reloadMessage.includes('Error')
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {reloadMessage}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100 placeholder-gray-400 flex-grow"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select
          className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
        >
          {sections.map(section => (
            <option key={section} value={section}>
              Section {section}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-2xl">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              {['Rank', 'Name', 'Section', 'LeetCode', 'Codeforces', 'CodeChef', 'GFG', 'Total'].map((header, index) => (
                <th
                  key={header}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider ${
                    index > 2 ? 'cursor-pointer hover:bg-gray-700/50' : ''
                  } transition-colors`}
                  onClick={() => {
                    if (index === 3) handleSort('lcTotal');
                    if (index === 4) handleSort('cfTotal');
                    if (index === 5) handleSort('ccTotal');
                    if (index === 6) handleSort('ggTotal');
                    if (index === 7) handleSort('lcTotal');
                  }}
                >
                  <div className="flex items-center gap-1">
                    {platformImages[header]&&
                    <img width="24" height="24" src = {platformImages[header]} alt ={header}></img>

                    }
                    {header}
                    {index > 2 && (
                        
                      <span className="text-indigo-400">
                        
                        {sortKey ===
                          (index === 3
                            ? 'lcTotal'
                            : index === 4
                            ? 'cfTotal'
                            : index === 5
                            ? 'ccTotal'
                            : index === 6
                            ? 'ggTotal'
                            : 'lcTotal') && (sortOrder === 'asc' ? '↑' : '↓')}
                            
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredAndSortedData.map((user, index) => (
              <tr
                key={user._id}
                className={`hover:bg-gray-700/30 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-indigo-900/20 via-blue-900/20 to-purple-900/20' : ''
                }`}
              >
                <td className="px-6 py-4 text-lg font-medium text-gray-200">{index + 1}</td>
                <td className="px-6 py-4">
                <div className={`flex items-center gap-1 text-lg font-semibold ${rankColors[user.cfRank.toLowerCase()] || 'text-gray-400'} whitespace-nowrap`}>
                    <span>{user.name}</span>
                    <span className="text-yellow-400">{user.ccRank}</span>
                </div>




                  <div className="text-sm text-gray-400">Roll: {user.roll}</div>
                </td>
                <td className="px-6 py-4 text-gray-300">{user.section}</td>
                <td className="px-6 py-4">
                  <a
                    href={`https://leetcode.com/${user.lcUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {user.lcTotal}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`https://codeforces.com/profile/${user.cfUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {user.cfTotal}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`https://www.codechef.com/users/${user.ccUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {user.ccTotal}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`https://auth.geeksforgeeks.org/user/${user.ggUsername}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {user.ggTotal}
                  </a>
                </td>
                <td className="px-6 py-4 text-xl font-bold text-gray-100">{user.lcTotal + user.cfTotal + user.ccTotal + user.ggTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-gray-400 text-sm">* Rankings update automatically. Click column headers to sort.</div>
    </div>
  );
};

export default LeaderBoard;
