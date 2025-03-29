import { useState } from 'react';
import UserData from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { IconButton } from '@mui/material';
import { DownloadIcon } from 'lucide-react';


export const PassingYearPerformanceChart = ({ data }: { data: UserData[] }) => {
  const COLORS = ['#3b82f6', '#f97316', '#14b8a6', '#e11d48', '#facc15', '#a855f7'];

  // Group data by passing year and calculate average totals
  const yearData = data.reduce((acc, user) => {
    if (!acc[user.passingYear]) {
      acc[user.passingYear] = { total: 0, count: 0 };
    }
    acc[user.passingYear].total += user.Total;
    acc[user.passingYear].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(yearData).map(([passingYear, { total, count }]) => ({
    passingYear,
    average: Math.round(total / count),
  }));

  return (
    <div className="bg-gray-800 p-6 border border-white/20 rounded-lg h-80 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">Performance by Passing Year</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={40} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="passingYear" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Legend />
          <Bar dataKey="average" name="Average Problems Solved" radius={[10, 10, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export const SectionPerformanceChart = ({ data }: { data: UserData[] }) => {
  const COLORS = ['#3b82f6', '#f97316', '#14b8a6', '#e11d48', '#facc15', '#a855f7'];

  // Group data by section and calculate average totals
  const sectionData = data.reduce((acc, user) => {
    if (!acc[user.section]) {
      acc[user.section] = { total: 0, count: 0 };
    }
    acc[user.section].total += user.Total;
    acc[user.section].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(sectionData).map(([section, { total, count }]) => ({
    section,
    average: Math.round(total / count),
  }));

  return (
    <div className="bg-gray-800 p-6 border border-white/20 rounded-lg h-80 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">Performance by Section</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={40} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="section" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Legend />
          <Bar dataKey="average" name="Average Problems Solved" radius={[10, 10, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export const PerformanceTrendChart = ({ data }: { data: UserData[] }) => {
  const COLORS = ['#3b82f6', '#f97316', '#14b8a6', '#e11d48', '#facc15', '#a855f7'];
  // Group data by branch and calculate average totals
  const branchData = data.reduce((acc, user) => {
    if (!acc[user.branch]) {
      acc[user.branch] = { total: 0, count: 0 };
    }
    acc[user.branch].total += user.Total;
    acc[user.branch].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(branchData).map(([branch, { total, count }]) => ({
    branch,
    average: Math.round(total / count),
  }));

  return (
    <div className="bg-gray-800 p-6 border border-white/20 rounded-lg h-80 flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">Performance by Branch</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={40} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis dataKey="branch" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#4b5563' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Legend />
          <Bar dataKey="average" name="Average Problems Solved" radius={[10, 10, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export const StatsCards = ({ data, platformTotals }: { data: UserData[], platformTotals: any }) => {
  const averageProblems = data.length > 0
    ? Math.round(data.reduce((sum, user) => sum + user.Total, 0) / data.length)
    : 0;

  const activeUsers = data.filter(user => user.Total > 0).length;
  const participationRate = data.length > 0
    ? Math.round((activeUsers / data.length) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-1">
      <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-gray-400 text-sm">Average Problems Solved</h3>
        <p className="text-2xl font-bold text-blue-400">{averageProblems}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-green-500">
        <h3 className="text-gray-400 text-sm">Active Participants</h3>
        <p className="text-2xl font-bold text-green-400">{activeUsers}/{data.length}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-purple-500">
        <h3 className="text-gray-400 text-sm">Participation Rate</h3>
        <p className="text-2xl font-bold text-purple-400">{participationRate}%</p>
      </div>
    </div>
  );
};

export const TopPerformers = ({ data }: { data: UserData[] }) => {
  const topPerformers = [...data]
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 5);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
      <div className="space-y-3">
        {topPerformers.map((user, index) => (
          <div key={user._id} className="flex items-center justify-between p-2 bg-gray-750 rounded">
            <div className="flex items-center">
              <span className="font-bold text-blue-400 mr-2">{index + 1}.</span>
              <span className="text-gray-100">{user.name}</span>
              <span className="text-gray-400 text-sm ml-2">({user.branch}-{user.section})</span>
            </div>
            <span className="bg-green-900 text-green-200 px-2 py-1 rounded-full text-sm font-medium">
              {user.Total} problems
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};



export const PlatformDistributionChart = ({ platformTotals }: { platformTotals: any }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const data = Object.entries(platformTotals)
    .filter(([_, value]) => (value as number) > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-gray-800 w-full border border-white/20 rounded-lg h-80 p-5 overflow-hidden flex flex-col justify-center items-center">
      <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
      <div className="w-full h-full flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70} // Reduced outerRadius to prevent overflow
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

  );
};




export const DataSummary = ({ filteredData, downloadExcel,platform }: { filteredData: UserData[], downloadExcel: any ,platform:string}) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort the data by Total
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortDirection === 'desc') {
      return b.Total - a.Total;
    } else {
      return a.Total - b.Total;
    }
  });

  const toggleSort = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-gray-800 mb-8 p-4 rounded-lg shadow-lg border border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-100 mb-2 md:mb-0">
          Filtered Students ({filteredData.length})
        </h2>
        <div className="text-sm text-gray-400 space-x-5">
          <span>
            Click on "Total Solved" to sort
          </span>
          <IconButton
            onClick={downloadExcel}
            className="!text-emerald-400 hover:!bg-emerald-900/30 !rounded-lg !p-2 !transition-all"
            title="Download Excel"
          >
            <DownloadIcon className="text-2xl" />
          </IconButton>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className=''>
            <tr className="bg-gray-900 text-gray-300">
              <th className="p-3 text-left rounded-tl-2xl rounded-bl-xl border-r border-white/35">Name</th>
              <th className="p-3 text-left border-r border-white/35">Branch</th>
              <th className="p-3 text-left border-r border-white/35">Section</th>
              <th className="p-3 text-left border-r border-white/35">Year</th>
              <th
                className="p-3 rounded-tr-2xl rounded-br-2xl text-left cursor-pointer hover:bg-gray-600 transition-colors "
                onClick={toggleSort}
              >
                <div className="flex items-center">
                  <span>Total Solved</span>
                  <span className="ml-1">
                    {sortDirection === 'desc' ? '↓' : '↑'}
                  </span>
                </div>
                <h1 className='text-sm font-normal text-gray-400'>({platform==='All'?"All Platform":platform})</h1>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((user, index) => (
              <tr
                key={user._id}
                className={`
                  ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
                    hover:bg-gray-600 border-b-1 border-gray-500
                `}
              >
                <td className="p-3 text-gray-100">{user.name}</td>
                <td className="p-3 text-gray-300">{user.branch}</td>
                <td className="p-3 text-gray-300">{user.section}</td>
                <td className="p-3 text-gray-300">{user.passingYear}</td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 font-bold text-green-500">
                    {user.Total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          No data available
        </div>
      )}
    </div>
  );
};
export const SummaryStatistics = ({ platformTotals }: { platformTotals: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-8">
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-white/35">
        <h2 className="text-lg font-semibold text-gray-300">LeetCode</h2>
        <p className="text-2xl font-bold text-green-400">
          {platformTotals['LeetCode']}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-white/35">
        <h2 className="text-lg font-semibold text-gray-300">CodeForces</h2>
        <p className="text-2xl font-bold text-blue-400">
          {platformTotals['CodeForces']}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-white/35">
        <h2 className="text-lg font-semibold text-gray-300">CodeChef</h2>
        <p className="text-2xl font-bold text-yellow-400">
          {platformTotals['CodeChef']}
        </p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-white/35">
        <h2 className="text-lg font-semibold text-gray-300">GFG</h2>
        <p className="text-2xl font-bold text-teal-400">
          {platformTotals['GFG']}
        </p>
      </div>
    </div>
  )
}