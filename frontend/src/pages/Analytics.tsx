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

  // Sample analytics data
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
    { label: 'Easy', value: analyticsData.easy, color: 'bg-green-500' },
    { label: 'Medium', value: analyticsData.medium, color: 'bg-yellow-500' },
    { label: 'Hard', value: analyticsData.hard, color: 'bg-red-500' },
  ];

  useEffect(()=>{
    console.log("analytics Page");
  },[]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Analytics</h1>
        <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Solved Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm mb-2">Total Solved</h3>
          <p className="text-3xl font-bold text-gray-800">{analyticsData.totalSolved}</p>
        </div>

        {/* Difficulty Distribution Card */}
        {difficultyDistribution.map((difficulty) => (
          <div key={difficulty.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm mb-4">{difficulty.label}</h3>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${difficulty.color} mr-3`}></div>
              <span className="text-2xl font-bold text-gray-800">{difficulty.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Difficulty Distribution</h3>
          <div className="space-y-4">
            {difficultyDistribution.map((difficulty) => (
              <div key={difficulty.label} className="flex items-center">
                <div className="w-24 text-gray-500">{difficulty.label}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.recentActivities.map((activity) => (
              <div key={activity.date} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                <span className="text-gray-600">{new Date(activity.date).toLocaleDateString()}</span>
                <span className="text-gray-800 font-medium">{activity.count} problems</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity Heatmap */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, index) => (
            <div
              key={index}
              className="h-8 bg-green-100 rounded-sm hover:bg-green-200 cursor-pointer"
              style={{ opacity: `${Math.random() * 0.5 + 0.3}` }}
            ></div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>Less</span>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;