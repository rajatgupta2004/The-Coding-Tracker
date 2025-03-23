import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton, } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import UserModal from './UserModel';
import { DownloadIcon } from 'lucide-react';
import UserData, { ContextType } from '../types';
import platformImages from '../platformImages';
import handleDownloadExcel from '../handleFunctions';
import Spinner from '../components/Spinner';

const URL = "https://leetcode-tracker-1-ucio.onrender.com";

const LeaderBoard: React.FC = () => {

  const { sampleData, loading, setSampleData } = useOutletContext<ContextType>()
  const [sortKey, setSortKey] = useState<keyof UserData>('Total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const [isReloading, setIsReloading] = useState(false);
  const [reloadMessage, setReloadMessage] = useState('');

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const handleReloadDatabase = async () => {
    setIsReloading(true);
    setReloadMessage('');
    try {
      await axios.get(URL + '/adduser');
      await axios.get(URL + '/refreshdatabase');
      const res = await axios.get(URL + '/data');
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

  const handleSort = (key: keyof UserData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sections = ['All', ...Array.from(new Set(sampleData.map((user) => user.section))).sort()];
  const years = ['All', ...Array.from(new Set(sampleData.map((user) => user.passingYear))).sort()];
  const branches = ['All', ...Array.from(new Set(sampleData.map((user) => user.branch))).sort()];

  const filteredAndSortedData = [...sampleData]
    .filter(
      user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedSection === 'All' || user.section === selectedSection) &&
        (selectedYear === 'All' || user.passingYear === selectedYear) &&
        (selectedBranch === 'All' || user.branch === selectedBranch)
    )
    .sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  if (loading) return <Spinner />

  return (
    <>
      <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
        {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
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
              className={`px-4 py-2 rounded-lg ${reloadMessage.includes('Error')
                ? 'bg-red-500/20 text-red-300'
                : 'bg-emerald-500/20 text-emerald-300'
                }`}
            >
              {reloadMessage}
            </span>
          )}
          <div className='flex justify-center space-x-1 w-full'>
            <h1 className="text-4xl w-fit font-bold mb-4 md:mb-0 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <h1 className='text-4xl'>🏆</h1>
          </div>
          <div className="flex items-center gap-4">

            <IconButton
              onClick={() => handleDownloadExcel(filteredAndSortedData)}
              className="!text-emerald-400 hover:!bg-emerald-900/30 !rounded-lg !p-2 !transition-all"
              title="Download Excel"
            >
              <DownloadIcon className="text-2xl" />

            </IconButton>

          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 overflow-x-auto">
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
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            {years.map(year => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>
                Branch {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-2xl">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                {['Rank', 'Name', 'LeetCode', 'Codeforces', 'CodeChef', 'GFG', 'Total'].map(
                  (header, index) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider ${index >= 2 ? 'cursor-pointer hover:bg-gray-700/50' : ''
                        } transition-colors`}
                      onClick={() => {
                        if (index === 2) handleSort('lcTotal');
                        if (index === 3) handleSort('cfTotal');
                        if (index === 4) handleSort('ccTotal');
                        if (index === 5) handleSort('ggTotal');
                        if (index === 6) handleSort('Total');
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {platformImages[header] && (
                          <img width="24" height="24" src={platformImages[header]} alt={header} />
                        )}
                        {header}
                        {index >= 2 && sortKey ===
                          (index === 2
                            ? 'lcTotal'
                            : index === 3
                              ? 'cfTotal'
                              : index === 4
                                ? 'ccTotal'
                                : index === 5
                                  ? 'ggTotal'
                                  : 'Total') && (sortOrder === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredAndSortedData.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-700/30 transition-colors ${index < 3 ? 'bg-gradient-to-r from-indigo-900/20 via-blue-900/20 to-purple-900/20' : ''
                    }`}
                >
                  <td className="px-6 py-4 text-lg font-medium text-gray-200">{index + 1}</td>
                  <td
                    className="px-6 py-4 cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className=' text-indigo-400 text-xl hover:text-indigo-300'>
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-400">{user.passingYear} / {user.branch} / {user.section} </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://leetcode.com/${user.lcUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >

                      {user.lcTotal === -1 ? <h1 className='text-red-500'>N/A</h1> : user.lcTotal}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://codeforces.com/profile/${user.cfUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {user.cfTotal === -1 ? <h1 className='text-red-500'>N/A</h1> : user.cfTotal}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://www.codechef.com/users/${user.ccUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {user.ccTotal === -1 ? <h1 className='text-red-500'>N/A</h1> : user.ccTotal}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://auth.geeksforgeeks.org/user/${user.ggUsername}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {user.ggTotal === -1 ? <h1 className='text-red-500'>N/A</h1> : user.ggTotal}
                    </a>
                  </td>
                  <td className="px-6 py-4 font-bold">{user.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">* Rankings update automatically. Click column headers to sort.</div>
      </div>


    </>
  );
};

export default LeaderBoard;
