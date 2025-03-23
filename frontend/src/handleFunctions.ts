import * as XLSX from 'xlsx';
import UserData from './types';
const handleDownloadExcel = (sampleData: UserData[]) => {
    // Define the headers
    const headers = [
        [
            'Rank',
            'Name',
            'Phone',
            'Email',
            'Roll',
            'Section',
            'Branch',
            'Passing Year',
            'LeetCode',
            'Codeforces',
            'CodeChef',
            'GFG',
            'Total',
        ],
    ];

    const excelData = sampleData.map((user, index) => [
        index + 1,
        user.name,
        user.phone,
        user.gmail,
        user.roll,
        user.section,
        user.branch,
        user.passingYear,
        user.lcTotal === -1 ? 'N/A' : user.lcTotal,
        user.cfTotal === -1 ? 'N/A' : user.cfTotal,
        user.ccTotal === -1 ? 'N/A' : user.ccTotal,
        user.ggTotal === -1 ? 'N/A' : user.ggTotal,
        user.Total,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...excelData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leaderboard');
    XLSX.writeFile(workbook, 'leaderboard_data.xlsx');
};

export default handleDownloadExcel;