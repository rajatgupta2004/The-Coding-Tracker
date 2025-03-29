import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import UserData, { ContextType } from '../types';
import * as XLSX from 'xlsx';
import { DataSummary, PassingYearPerformanceChart, PerformanceTrendChart, PlatformDistributionChart, SectionPerformanceChart, StatsCards, SummaryStatistics, TopPerformers } from '../components/Components';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

const Analytics: React.FC = () => {
  const { sampleData } = useOutletContext<ContextType>();


  // State management
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [branch, setBranch] = useState<string>('All');
  const [section, setSection] = useState<string>('All');
  const [year, setYear] = useState<string>('All');
  const [platform, setPlatform] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('2025-01');
  const [toDate, setToDate] = useState<string>('2025-03');
  const [showData, setShowData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [platformTotals, setPlatformTotals] = useState({});
  const [minProblems, setMinProblems] = useState<number>(0);
  const [allTime, setAllTime] = useState<true | false>(false);


  // Extract unique values from sampleData
  const availableBranches = useMemo(() => {
    const branches = new Set(sampleData.map(user => user.branch));
    return ['All', ...Array.from(branches).sort()];
  }, [sampleData]);

  const availableSections = useMemo(() => {
    const sections = new Set(sampleData.map(user => user.section));
    return ['All', ...Array.from(sections).sort()];
  }, [sampleData]);

  const availableYears = useMemo(() => {
    const years = new Set(sampleData.map(user => user.passingYear));
    return ['All', ...Array.from(years).sort()];
  }, [sampleData]);



  console.log('Platform totals useState', platformTotals);
  const downloadExcel = () => {
    const excelData = filteredData.map((user) => ({
      Name: user.name,
      Roll: user.roll,
      Branch: user.branch,
      Section: user.section,
      Passing_Year: user.passingYear,
      From_date: fromDate,
      To_date: toDate,
      [platform]: user.Total
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics Data');
    XLSX.writeFile(workbook, 'analytics_data.xlsx');
  };


  const applyFilters = () => {
    if (!allTime && fromDate > toDate) {
      setError('⚠️ Invalid date range! Start date cannot be greater than end date.');
      setShowData(false);
      return;
    } else if (!allTime && fromDate == toDate) {
      setError('⚠️ Invalid date range! Start date cannot be Equal to end date.');
      setShowData(false);
      return;
    }
    let processedData = sampleData;
    // Filter by name

    if (search) {
      processedData = processedData.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by branch, section, and year
    if (branch !== 'All') processedData = processedData.filter((user) => user.branch === branch);
    if (section !== 'All')
      processedData = processedData.filter((user) => user.section === section);
    if (year !== 'All') processedData = processedData.filter((user) => user.passingYear === year);

    // Filter and calculate the correct total problems between fromDate and toDate
    processedData = processedData.map((user) => {
      // Get total before the start date
      const totalBeforeStart = user.history
        .filter((h) => `${h.year}-${h.month.padStart(2, '0')}` === fromDate)
        .reduce(
          (sum, h) =>
            sum +
            h.lcTotal +
            h.cfTotal +
            h.ccTotal +
            h.ggTotal,
          0
        );

      // Get total until the end date
      const totalUntilEnd = user.history
        .filter((h) => `${h.year}-${h.month.padStart(2, '0')}` === toDate)
        .reduce(
          (sum, h) =>
            sum +
            h.lcTotal +
            h.cfTotal +
            h.ccTotal +
            h.ggTotal,
          0
        );

      // Correct total problems solved in the range
      const filteredTotal = allTime?user.Total: totalUntilEnd - totalBeforeStart;
      return { ...user, Total: filteredTotal };
    });

    // Corrected platform-specific logic in processedprocessedData
    if (platform !== 'All') {
      processedData = processedData.map((user) => {
        const totalBeforeStart = user.history
          .filter((h) => `${h.year}-${h.month.padStart(2, '0')}` === fromDate)
          .reduce(
            (sum, h) =>
              sum +
              (platform === 'LeetCode'
                ? h.lcTotal
                : platform === 'CodeForces'
                  ? h.cfTotal
                  : platform === 'CodeChef'
                    ? h.ccTotal
                    : h.ggTotal),
            0
          );

        const totalUntilEnd = user.history
          .filter((h) => `${h.year}-${h.month.padStart(2, '0')}` === toDate)
          .reduce(
            (sum, h) =>
              sum +
              (platform === 'LeetCode'
                ? h.lcTotal
                : platform === 'CodeForces'
                  ? h.cfTotal
                  : platform === 'CodeChef'
                    ? h.ccTotal
                    : h.ggTotal),
            0
          );

        // Correct platform-specific total using subtraction
        let filteredTotal = totalUntilEnd - totalBeforeStart;
        if(allTime && platform === 'LeetCode'){
          filteredTotal = user.lcTotal;
        }else if(allTime && platform === 'CodeForces'){
          filteredTotal = user.cfTotal;
        }else if(allTime && platform === 'CodeChef'){
          filteredTotal = user.ccTotal;
        }else if(allTime){
          filteredTotal = user.ggTotal;
        }
        return { ...user, Total: filteredTotal };
      });
    }


    if (processedData.length === 0) {
      setError('⚠️ No matching records found! Please try different filters.');
      setShowData(false);
      return;
    }

    if (minProblems > 0) {
      processedData = processedData.filter((user) => user.Total >= minProblems);
    }

    setError(null);
    const getPlatformTotals = (platform: string) => {
      return processedData.reduce((sum, user) => {
        const totalBeforeStart = user.history
          .filter((h: any) => `${h.year}-${h.month.padStart(2, '0')}` === fromDate)
          .reduce(
            (total: any, h: any) =>
              total + 
              (platform === 'LeetCode'
                ? h.lcTotal
                : platform === 'CodeForces'
                  ? h.cfTotal
                  : platform === 'CodeChef'
                    ? h.ccTotal
                    : h.ggTotal),
            0
          );

        const totalUntilEnd = user.history
          .filter((h: any) => `${h.year}-${h.month.padStart(2, '0')}` === toDate)
          .reduce(
            (total: any, h: any) =>
              total +
            (
              allTime ? (platform === 'LeetCode'
                ? user.lcTotal
                : platform === 'CodeForces'
                  ? user.cfTotal
                  : platform === 'CodeChef'
                    ? user.ccTotal
                    : user.ggTotal):
                    (platform === 'LeetCode'
                      ? h.lcTotal
                      : platform === 'CodeForces'
                        ? h.cfTotal
                        : platform === 'CodeChef'
                          ? h.ccTotal
                          : h.ggTotal)
            ),
            0
          );

        // Correct platform-specific total by subtracting
        const filteredTotal = totalUntilEnd - (allTime? 0:totalBeforeStart);
        return sum + filteredTotal;
      }, 0);
    };

    setPlatformTotals((prv) => ({ LeetCode: getPlatformTotals("LeetCode"), CodeForces: getPlatformTotals("CodeForces"), CodeChef: getPlatformTotals("CodeChef"), GFG: getPlatformTotals("GFG") }))
    setFilteredData(processedData);
    setShowData(true);
  }


  return (
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="w-full flex items-center justify-center p-1 pb-7 border-b border-gray-700">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <h1 className="text-3xl ml-2">📈</h1>
        </div>

      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by student name"
          className="p-2 bg-gray-800 border border-gray-600 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          title='Search for Student'
        />
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          title='Select Passout Year'
          className="p-2 bg-gray-800 border border-gray-600 rounded-lg  hover:cursor-pointer"
        >
          {availableYears.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption === 'All' ? 'All Years' : yearOption}
            </option>
          ))}
        </select>

        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          title='Select Branch'
          className="p-2 bg-gray-800 border border-gray-600 rounded-lg  hover:cursor-pointer"
        >
          {availableBranches.map((branchOption) => (
            <option key={branchOption} value={branchOption}>
              {branchOption === 'All' ? 'All Branches' : branchOption}
            </option>
          ))}
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          title='Select Section'
          className="p-2 bg-gray-800 border border-gray-600 rounded-lg  hover:cursor-pointer"
        >
          {availableSections.map((sectionOption) => (
            <option key={sectionOption} value={sectionOption}>
              {sectionOption === 'All' ? 'All Sections' : sectionOption}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div 
        title='Check this to See All time Data'
        className="p-2 bg-gray-800 border border-gray-600 rounded-lg flex items-center pl-3 space-x-2">
          <input
            type="checkbox"
            checked={allTime}
            onChange={() => setAllTime(!allTime)}
            className="w-5 h-5 hover:cursor-pointer"
            id='All-time'
          />
          <label className="text-gray-200 whitespace-nowrap hover:cursor-pointer" htmlFor='All-time'>All Time Data</label>
        </div>
        <input
          type="month"
          value={fromDate}
          title='Select Starting Date'
          onChange={(e) => setFromDate(e.target.value)}
          className={`p-2 bg-gray-800 border border-gray-600 rounded-lg ${allTime ? 'cursor-not-allowed' : 'hover:cursor-pointer'
            } text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150`}
          disabled={allTime}
        />

        <input
          type="month"
          value={toDate}
          title='Select Ending Date'
          onChange={(e) => setToDate(e.target.value)}
          className={`p-2 bg-gray-800 border border-gray-600 rounded-lg ${allTime ? 'cursor-not-allowed' : 'hover:cursor-pointer'
          } text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-150`}
          disabled={allTime}
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          title='Select Platform'
          className="p-2 bg-gray-800 border border-gray-600 rounded-lg hover:cursor-pointer"
        >
          <option value="All">All Platforms</option>
          <option value="LeetCode">LeetCode</option>
          <option value="CodeForces">CodeForces</option>
          <option value="CodeChef">CodeChef</option>
          <option value="GFG">GFG</option>
        </select>

        <input
          title='Enter the Minimum numbers of Problems Solved'
          type="number"
          placeholder="Minimum Problems Solved"
          className="p-2 bg-gray-800 border border-gray-600 rounded-lg"
          onChange={(e) => setMinProblems(Number(e.target.value))}
        />

      </div>
      <div className='w-full inline-flex justify-center p-2 mb-8'>
        <button
          title='Click to Apply Filters'
          onClick={applyFilters}
          className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-6 py-2 rounded-lg shadow-lg"
        >
          Apply Filters 🎯
        </button>

      </div>


      {/* Error Handling */}
      {error && (
        <div className="bg-red-600 p-3 mb-4 mt-10 text-white text-center rounded-lg">
          {error}
        </div>
      )}

      {showData &&
        <>


          <div className='bg-gray-900 p-2 border border-gray-600 rounded-xl'>

            <Tabs
              aria-label="Basic tabs"
              defaultValue={0}
              sx={{
                backgroundColor: '#111827', // Equivalent to Tailwind bg-gray-800
                borderRadius: '8px', // Optional rounded corners
                padding: '8px', // Optional padding
                color: '#fff', // Set text color to white
              }}
            >
              <TabList
                sx={{
                  '& .MuiTab-root': {
                    color: '#fff', // Default text color for tabs
                    '&.Mui-selected': {
                      color: '#111827', // Optional: Change color when selected (e.g., gold)
                    },
                  },
                }}
              >
                <Tab>Table Data</Tab>
                <Tab>Graph Data</Tab>
              </TabList>

              <TabPanel
                value={0}
                sx={{
                  color: '#fff', // Text color inside the tab panel
                }}
              >
                <SummaryStatistics platformTotals={platformTotals} />
                <DataSummary filteredData={filteredData} downloadExcel={downloadExcel} platform={platform} />


              </TabPanel>
              <TabPanel
                value={1}
                sx={{
                  color: '#fff',
                }}
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8'>
                  <PlatformDistributionChart platformTotals={platformTotals} />
                  <PerformanceTrendChart data={filteredData} />
                  <SectionPerformanceChart data={filteredData} />
                  <PassingYearPerformanceChart data={filteredData} />

                </div>
              </TabPanel>
            </Tabs>

          </div>


        </>
      }
    </div>
  );
};

export default Analytics;
