import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { ContextType } from '../types';
import { LineChart, Download } from 'lucide-react';
import { Card, Button } from '@mui/material';
import { SectionwiseYearwise, Platformwise, TopPerformers } from '../components/Components';
import * as XLSX from 'xlsx';

interface TrendData {
  date: string;
  total: number;
  lcTotal: number;
  cfTotal: number;
  ccTotal: number;
  ggTotal: number;
};

const Analytics: React.FC = () => {
  const { sampleData } = useOutletContext<ContextType>();
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedFilterYear, setSelectedFilterYear] = useState<string>('Current');
  const [selectedFilterMonth, setSelectedFilterMonth] = useState<string>('Current');
  
  const sections = ['All', ...Array.from(new Set(sampleData.map((user) => user.section))).sort()];
  const years = ['All', ...Array.from(new Set(sampleData.map((user) => user.passingYear))).sort()];
  const branches = ['All', ...Array.from(new Set(sampleData.map((user) => user.branch))).sort()];
  
  // Get available years and months from history
  const availableYears = ['Current', ...Array.from(new Set(
    sampleData.flatMap(user => 
      user.history.map(entry => entry.year)
    )
  )).sort()];
  
  const availableMonths = ['Current', ...Array.from(new Set(
    sampleData.flatMap(user => 
      user.history.map(entry => entry.month)
    )
  )).sort()];

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return sampleData.filter(user => {
      // Filter by user properties
      const matchesSection = selectedSection === 'All' || user.section === selectedSection;
      const matchesYear = selectedYear === 'All' || user.passingYear === selectedYear;
      const matchesBranch = selectedBranch === 'All' || user.branch === selectedBranch;
      // Filter by history month/year if specified
      let matchesHistory = true;
      if (selectedFilterYear !== 'Current' || selectedFilterMonth !== 'Current') {
        matchesHistory = user.history.some(entry => {
          const matchesHistoryYear = selectedFilterYear === 'Current' || entry.year === selectedFilterYear;
          const matchesHistoryMonth = selectedFilterMonth === 'Current' || entry.month === selectedFilterMonth;
          return matchesHistoryYear && matchesHistoryMonth;
        });
      }
      return matchesSection && matchesYear && matchesBranch && matchesHistory;
    });
  }, [sampleData, selectedSection, selectedYear, selectedBranch, selectedFilterYear, selectedFilterMonth]);

  // Function to download data as Excel
  const downloadExcel = () => {
    // Prepare data for download
    const dataToExport = filteredData.map(user => {
      // Find the specific history entry if filtered
      let historyEntry = user.history[0]; // default to first entry
      if (selectedFilterYear !== 'Current' || selectedFilterMonth !== 'Current') {
        historyEntry = user.history.find(entry => {
          const matchesYear = selectedFilterYear === 'Current' || entry.year === selectedFilterYear;
          const matchesMonth = selectedFilterMonth === 'Current' || entry.month === selectedFilterMonth;
          return matchesYear && matchesMonth;
        }) || user.history[0];
      }
      
      return {
        Name: user.name,
        Roll: user.roll,
        Passing_Year: user.passingYear,
        Branch: user.branch,
        Section: user.section,
        'LeetCode Easy': historyEntry.lcEasy,
        'LeetCode Medium': historyEntry.lcMedium,
        'LeetCode Hard': historyEntry.lcHard,
        'LeetCode Total': historyEntry.lcTotal,
        'CodeForces Rank': historyEntry.cfRank,
        'CodeForces Rating': historyEntry.cfRating,
        'CodeForces Total': historyEntry.cfTotal,
        'CodeChef Rank': historyEntry.ccRank,
        'CodeChef Rating': historyEntry.ccRating,
        'CodeChef Total': historyEntry.ccTotal,
        'GeeksforGeeks Total': historyEntry.ggTotal,
        'Total Score': historyEntry.Total,
        Month: historyEntry.month,
        Year: historyEntry.year
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentData");
    
    // Generate file name based on filters
    let fileName = 'StudentData';
    if (selectedFilterYear !== 'Current') fileName += `_${selectedFilterYear}`;
    if (selectedFilterMonth !== 'Current') fileName += `_${selectedFilterMonth}`;
    if (selectedBranch !== 'All') fileName += `_${selectedBranch}`;
    if (selectedSection !== 'All') fileName += `_${selectedSection}`;
    
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Summary Statistics
  const totalUsers = filteredData.length;

  // Year-wise Analysis
  const yearData = filteredData.reduce((acc, user) => {
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
  const branchData = filteredData.reduce((acc, user) => {
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
  const sectionData = filteredData.reduce((acc, user) => {
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
  const topPerformers = filteredData.sort((a, b) => b.Total - a.Total).slice(0, 5);


  // Calculate total problems solved based on filters
  const totalProblemsSolved = useMemo(() => {
    return filteredData.reduce((total, user) => {
      // Find the matching history entry based on filters
      let historyEntry = user.history[0]; // default to first entry
      if (selectedFilterYear !== 'Current' || selectedFilterMonth !== 'Current') {
        historyEntry = user.history.find(entry => {
          const matchesYear = selectedFilterYear === 'Current' || entry.year === selectedFilterYear;
          const matchesMonth = selectedFilterMonth === 'Current' || entry.month === selectedFilterMonth;
          return matchesYear && matchesMonth;
        }) || user.history[0];
      }
      return total + (historyEntry?.Total || 0);
    }, 0);
  }, [filteredData, selectedFilterYear, selectedFilterMonth]);

  return (
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <div className='flex justify-between items-center mb-8'>
        <div className='flex items-center'>
          <h1 className="text-4xl w-fit text-center font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <h1 className='text-3xl ml-2'>📈</h1>
        </div>
        <Button 
          variant="contained" 
          startIcon={<Download size={18} />}
          onClick={downloadExcel}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="w-full rounded-lg mb-8 grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Year and Month filters for history */}
        <div className='flex flex-col p-1'>
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedFilterYear}
            onChange={e => setSelectedFilterYear(e.target.value)}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label className='ml-2 text-gray-400'>Data Year</label>
        </div>

        <div className='flex flex-col p-1'>
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedFilterMonth}
            onChange={e => setSelectedFilterMonth(e.target.value)}
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <label className='ml-2 text-gray-400'>Data Month</label>
        </div>

        {/* User property filters */}
        <div className='flex flex-col p-1'>
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label className='ml-2 text-gray-400'>Passout Year</label>
        </div>

        <div className='flex flex-col p-1'>
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <label className='ml-2 text-gray-400'>Branch</label>
        </div>

        <div className='flex flex-col p-1'>
          <select
            className="bg-gray-800 px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
          >
            {sections.map(section => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          <label className='ml-2 text-gray-400'>Section</label>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105">
          <h2 className="text-lg font-semibold text-gray-300">Total Users</h2>
          <p className="text-2xl font-bold text-indigo-400">{totalUsers}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105">
          <h2 className="text-lg font-semibold text-gray-300">Total Problems Solved</h2>
          <p className="text-2xl font-bold text-emerald-400">{totalProblemsSolved}</p>
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

      {/* Platform-wise */}
      <Platformwise sampleData={filteredData}/>

      {/* Section-wise & Year-wise */}
      <SectionwiseYearwise yearChartData={yearChartData} sectionChartData={sectionChartData}/>
      
      {/* Top Performers */}
      <TopPerformers topPerformers={topPerformers}/>
    </div>
  );
};

export default Analytics;