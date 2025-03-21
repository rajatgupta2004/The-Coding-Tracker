import React, { useEffect } from 'react';

interface AnalyticsData {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  recentActivities: {
    date: string;
    count: number;
  }[];
}

const Analytics: React.FC = () => {
  const analyticsData: AnalyticsData = {
    totalSolved: 458,
    easy: 245,
    medium: 162,
    hard: 51,
    recentActivities: [
      { date: '2024-02-15', count: 12 },
      { date: '2024-02-14', count: 8 },
      { date: '2024-02-13', count: 15 },
      { date: '2024-02-12', count: 10 },
      { date: '2024-02-11', count: 5 },
    ],
  };

  const difficultyDistribution = [
    { label: 'Easy', value: analyticsData.easy, color: 'bg-green-400' },
    { label: 'Medium', value: analyticsData.medium, color: 'bg-yellow-400' },
    { label: 'Hard', value: analyticsData.hard, color: 'bg-red-400' },
  ];

  useEffect(() => {
    console.log("analytics Page");
  }, []);

  return (
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent mb-2">
          Progress Analytics
        </h1>
        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Solved Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
          <h3 className="text-gray-400 text-sm mb-2">Total Solved</h3>
          <p className="text-3xl font-bold text-yellow-400">{analyticsData.totalSolved}</p>
        </div>

        {/* Difficulty Distribution Cards */}
        {difficultyDistribution.map((difficulty) => (
          <div key={difficulty.label} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
            <h3 className="text-gray-400 text-sm mb-4">{difficulty.label}</h3>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${difficulty.color} mr-3`}></div>
              <span className="text-2xl font-bold text-gray-100">{difficulty.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Progress */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Difficulty Distribution</h3>
          <div className="space-y-4">
            {difficultyDistribution.map((difficulty) => (
              <div key={difficulty.label} className="flex items-center">
                <div className="w-24 text-gray-400">{difficulty.label}</div>
                <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${difficulty.color} transition-all duration-500`}
                    style={{ width: `${(difficulty.value / analyticsData.totalSolved) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.recentActivities.map((activity) => (
              <div key={activity.date} className="flex justify-between items-center p-3 hover:bg-gray-700/30 rounded-lg transition-colors">
                <span className="text-gray-400">{new Date(activity.date).toLocaleDateString()}</span>
                <span className="text-gray-100 font-medium">{activity.count} problems</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity Heatmap */}
      <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Weekly Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-green-900/50 rounded-sm hover:bg-green-800 cursor-pointer transition-colors"
              style={{ opacity: `${Math.random() * 0.5 + 0.3}` }}
            ></div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <span>Less</span>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;