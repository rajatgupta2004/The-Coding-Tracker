import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { ContextType } from '../types';

const Analytics: React.FC = () => {
  const { sampleData } = useOutletContext<ContextType>();

  // Summary Statistics
  const totalUsers = sampleData.length;
  const platformTotals = {
    lcTotal: sampleData.reduce((sum, user) => sum + (user.lcTotal === -1 ? 0 : user.lcTotal), 0),
    cfTotal: sampleData.reduce((sum, user) => sum + (user.cfTotal === -1 ? 0 : user.cfTotal), 0),
    ccTotal: sampleData.reduce((sum, user) => sum + (user.ccTotal === -1 ? 0 : user.ccTotal), 0),
    ggTotal: sampleData.reduce((sum, user) => sum + (user.ggTotal === -1 ? 0 : user.ggTotal), 0),
  };

  // Platform-wise Distribution
  const platformData = [
    { name: 'LeetCode', value: platformTotals.lcTotal },
    { name: 'Codeforces', value: platformTotals.cfTotal },
    { name: 'CodeChef', value: platformTotals.ccTotal },
    { name: 'GFG', value: platformTotals.ggTotal },
  ];

  const COLORS = ['#4CAF50', '#00BFFF', '#FFA500', '#FF4500'];

  // Year-wise Analysis
  const yearData = sampleData.reduce((acc, user) => {
    if (!acc[user.passingYear]) {
      acc[user.passingYear] = { total: 0, count: 0 };
    }
    acc[user.passingYear].total += user.Total;
    acc[user.passingYear].count += 1;
    return acc;
  }, {} as { [key: string]: { total: number; count: number } });

  const yearChartData = Object.keys(yearData).map(year => ({
    year,
    average: yearData[year].total / yearData[year].count,
  }));

  // Branch-wise Analysis
  const branchData = sampleData.reduce((acc, user) => {
    if (!acc[user.branch]) {
      acc[user.branch] = { total: 0, count: 0 };
    }
    acc[user.branch].total += user.Total;
    acc[user.branch].count += 1;
    return acc;
  }, {} as { [key: string]: { total: number; count: number } });

  const branchChartData = Object.keys(branchData).map(branch => ({
    branch,
    average: branchData[branch].total / branchData[branch].count,
  }));

  // Top 5 Branches
  const topBranches = branchChartData.sort((a, b) => b.average - a.average).slice(0, 5);

  // Section-wise Analysis
  const sectionData = sampleData.reduce((acc, user) => {
    if (!acc[user.section]) {
      acc[user.section] = { total: 0, count: 0 };
    }
    acc[user.section].total += user.Total;
    acc[user.section].count += 1;
    return acc;
  }, {} as { [key: string]: { total: number; count: number } });

  const sectionChartData = Object.keys(sectionData).map(section => ({
    section,
    average: sectionData[section].total / sectionData[section].count,
  }));

  // Top Performers
  const topPerformers = sampleData.sort((a, b) => b.Total - a.Total).slice(0, 5);

  return (
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <div className='flex justify-center'>
        <h1 className="text-4xl w-fit text-center font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <h1 className='text-3xl'>📈</h1>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105">
          <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
          <p className="text-2xl font-bold text-indigo-400">{totalUsers}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105">
          <h2 className="text-lg font-semibold text-gray-300">Total Sections</h2>
          <p className="text-2xl font-bold text-emerald-400">{Object.keys(sectionData).length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105">
          <h2 className="text-lg font-semibold text-gray-300">Total Branches</h2>
          <p className="text-2xl font-bold text-blue-400">{Object.keys(branchData).length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105">
          <h2 className="text-lg font-semibold text-gray-300">Total Years</h2>
          <p className="text-2xl font-bold text-green-400">{Object.keys(yearData).length}</p>
        </div>
      </div>

      {/* Platform-wise & Branch-wise */}
      <div className="bg-gray-800 p-6 overflow-x-auto rounded-lg mb-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={platformData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {platformData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="flex justify-center">
          <BarChart width={400} height={300} data={topBranches}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="branch" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#facc15" />
          </BarChart>
        </div>
      </div>

      {/* Section-wise & Year-wise */}
      <div className="bg-gray-800 overflow-x-auto p-6 rounded-lg mb-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <BarChart width={400} height={300} data={sectionChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="section" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#FF8042" />
          </BarChart>
        </div>
        <div className="flex justify-center">
          <BarChart width={400} height={300} data={yearChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Top Performers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.map((user) => (
            <div key={user._id} className="bg-gray-700 p-4 rounded-lg transition hover:scale-105">
              <h3 className="text-lg font-semibold text-indigo-400">{user.name}</h3>
              <p className="text-sm text-gray-400">
                {user.passingYear} / {user.branch} / {user.section}
              </p>
              <p className="text-xl font-bold text-emerald-400">Total Score: {user.Total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
