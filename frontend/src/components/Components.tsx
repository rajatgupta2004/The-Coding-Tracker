import UserData from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import { Trophy, Award, Star, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { HTMLAttributes } from 'react';

// Dark theme color palettes
const BAR_COLORS = [
  '#6366f1', // indigo-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6'  // teal-500
];

const PIE_COLORS = [
  '#3b82f6', // blue-500
  '#f97316', // orange-500
  '#84cc16', // lime-500
  '#06b6d4', // cyan-500
  '#a855f7', // purple-500
  '#eab308'  // yellow-500
];
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}
const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div 
      className={`bg-gray-800 rounded-lg border border-gray-800 shadow-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export function TopPerformers({ topPerformers }: { topPerformers: UserData[] }) {
  const rankColors = [
    'bg-gradient-to-r from-yellow-500 to-yellow-600', // 1st place
    'bg-gradient-to-r from-gray-400 to-gray-500',     // 2nd place
    'bg-gradient-to-r from-amber-600 to-amber-700',   // 3rd place
    'bg-gradient-to-r from-gray-700 to-gray-800',     // 4th place
    'bg-gradient-to-r from-gray-700 to-gray-800'      // 5th place
  ];

  return (
    <Card className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-lg">
      <div className="flex items-center mb-4">
        <Trophy className="text-yellow-400 mr-2" size={24} />
        <h2 className="text-xl font-semibold text-gray-200">Top Performers</h2>
      </div>
      
      <div className="space-y-3">
        {topPerformers.map((user, index) => (
          <div
            key={user._id}
            className={`flex items-center justify-between p-4 rounded-lg ${rankColors[index]} transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < 3 ? 'bg-white/90' : 'bg-gray-900/70'
              }`}>
                <span className={`text-sm font-bold ${
                  index < 3 ? 'text-gray-900' : 'text-gray-200'
                }`}>
                  {index + 1}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                <p className="text-sm text-white/80">
                  {user.passingYear} • {user.branch} • {user.section}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Star className="text-white mr-2" size={18} />
              <span className="text-xl font-bold text-white">{user.Total}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
export function SectionwiseYearwise({sectionChartData, yearChartData}:{sectionChartData:any ,yearChartData:any}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-gray-800 p-4 rounded-lg border border-gray-800">
        <div className="flex items-center mb-4">
          <BarChart2 className="text-indigo-400 mr-2" size={24} />
          <h3 className="text-lg font-semibold text-gray-200">Section-wise Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectionChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="section" 
              stroke="#6b7280" 
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827',
                borderColor: '#374151',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="average" name="Average Score">
              {sectionChartData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={BAR_COLORS[index % BAR_COLORS.length]} 
                  stroke="#1f2937"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-gray-800 p-4 rounded-lg border border-gray-800">
        <div className="flex items-center mb-4">
          <BarChart2 className="text-violet-400 mr-2" size={24} />
          <h3 className="text-lg font-semibold text-gray-200">Passout-Year-wise Performance</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280" 
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#6b7280" 
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111827',
                borderColor: '#374151',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#f3f4f6' }}
            />
            <Bar dataKey="average" name="Average Score">
              {yearChartData.map((entry: any, index: number) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={BAR_COLORS[(index + 2) % BAR_COLORS.length]} 
                  stroke="#1f2937"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

export function Platformwise({sampleData}:{sampleData:UserData[]}) {
  const platformTotals = {
    lcTotal: sampleData.reduce((sum, user) => sum + (user.lcTotal === -1 ? 0 : user.lcTotal), 0),
    cfTotal: sampleData.reduce((sum, user) => sum + (user.cfTotal === -1 ? 0 : user.cfTotal), 0),
    ccTotal: sampleData.reduce((sum, user) => sum + (user.ccTotal === -1 ? 0 : user.ccTotal), 0),
    ggTotal: sampleData.reduce((sum, user) => sum + (user.ggTotal === -1 ? 0 : user.ggTotal), 0),
  };

  const platformData = [
    { name: 'LeetCode', value: platformTotals.lcTotal, icon: '💻' },
    { name: 'Codeforces', value: platformTotals.cfTotal, icon: '⚔️' },
    { name: 'CodeChef', value: platformTotals.ccTotal, icon: '👨‍🍳' },
    { name: 'GFG', value: platformTotals.ggTotal, icon: '📚' },
  ];

  return (
    <Card className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-800 mb-8">
      <div className="flex items-center mb-4">
        <PieChartIcon className="text-emerald-400 mr-2" size={24} />
        <h2 className="text-xl font-semibold text-gray-200">Platform Distribution</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => (
                  <text 
                    x={0} 
                    y={0} 
                    fill="#e5e7eb" 
                    textAnchor="middle" 
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${name}: ${(percent * 100).toFixed(0)}%`}
                  </text>
                )}
                outerRadius={120}
                innerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {platformData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={PIE_COLORS[index % PIE_COLORS.length]} 
                    stroke="#1f2937"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827',
                  borderColor: '#374151',
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [value, 'Problems Solved']}
                itemStyle={{ color: '#f3f4f6' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span className="text-gray-300 text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          {platformData.map((platform, index) => (
            <div key={platform.name} className="flex items-center">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl"
                style={{ 
                  backgroundColor: `${PIE_COLORS[index]}20`, 
                  border: `2px solid ${PIE_COLORS[index]}` 
                }}
              >
                {platform.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300 font-medium">{platform.name}</span>
                  <span className="text-gray-400 font-mono">{platform.value}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{
                      width: `${(platform.value / Math.max(...platformData.map(p => p.value))) * 100}%`,
                      backgroundColor: PIE_COLORS[index]
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}