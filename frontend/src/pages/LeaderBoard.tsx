import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface UserData {
  id: number;
  name: string;
  username: string;
  section: string;
  easy: number;
  medium: number;
  hard: number;
  all: number;
}

const LeaderBoard: React.FC = () => {
    const [sortKey, setSortKey] = useState<keyof UserData>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSection, setSelectedSection] = useState('All');
    const [loading, setLoading] = useState(true);
    const [isReloading, setIsReloading] = useState(false);
    const [reloadMessage, setReloadMessage] = useState('');
    const [sampleData, setSampleData] = useState<UserData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/data');
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
            await axios.get('http://localhost:3000/adduser');
            const res = await axios.get('http://localhost:3000/data');
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

    const sections = ['All', ...Array.from(new Set(sampleData?.map(item => item.section)))];

    const filteredAndSortedData = [...sampleData]
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortKey] > b[sortKey] ? 1 : -1;
            }
            return a[sortKey] < b[sortKey] ? 1 : -1;
        })
        .filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedSection === 'All' || user.section === selectedSection)
        );

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen bg-blue-100'>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress sx={{ color: '#4f46e5' }} />
                </Box>
            </div>
        );
    }

    return (
        <div className="p-6 m-5 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-4xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
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
                        <span className={`px-4 py-2 rounded-lg ${reloadMessage.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <select
                    className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
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
                            {['Rank', 'Name', 'Section', 'Easy', 'Medium', 'Hard', 'Total'].map((header, index) => (
                                <th 
                                    key={header}
                                    className={`px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider ${
                                        index > 2 ? 'cursor-pointer hover:bg-gray-700/50' : ''
                                    } transition-colors`}
                                    onClick={() => {
                                        if (index === 3) handleSort('easy');
                                        if (index === 4) handleSort('medium');
                                        if (index === 5) handleSort('hard');
                                        if (index === 6) handleSort('all');
                                    }}
                                >
                                    <div className="flex items-center gap-1">
                                        {header}
                                        {index > 2 && (
                                            <span className="text-indigo-400">
                                                {sortKey === 
                                                    (index === 3 ? 'easy' : 
                                                     index === 4 ? 'medium' : 
                                                     index === 5 ? 'hard' : 'all') && 
                                                    (sortOrder === 'asc' ? '↑' : '↓')}
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
                                key={user.id}
                                className={`hover:bg-gray-700/30 transition-colors ${
                                    index < 3 ? 'bg-gradient-to-r from-indigo-900/20 via-blue-900/20 to-purple-900/20' : ''
                                }`}
                            >
                                <td className="px-6 py-4 text-lg font-medium text-gray-200">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-lg font-semibold text-gray-100">{user.name}</div>
                                    <a 
                                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                        href={`https://leetcode.com/u/${user.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        @{user.username}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-gray-300">{user.section}</td>
                                <td className="px-6 py-4 text-green-400">{user.easy}</td>
                                <td className="px-6 py-4 text-yellow-400">{user.medium}</td>
                                <td className="px-6 py-4 text-red-400">{user.hard}</td>
                                <td className="px-6 py-4 text-xl font-bold text-gray-100">{user.all}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-center text-gray-400 text-sm">
                * Rankings update automatically. Click column headers to sort.
            </div>
        </div>
    );
};

export default LeaderBoard;