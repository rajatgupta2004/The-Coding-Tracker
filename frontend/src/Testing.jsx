    <Card title="Average Performance Over Time" className="bg-gray-800 border-gray-700">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={filteredData.flatMap(prepareTrendData)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                  <Line type="monotone" dataKey="lcTotal" stroke="#FFA116" name="LeetCode" />
                  <Line type="monotone" dataKey="cfTotal" stroke="#1F8ACB" name="Codeforces" />
                </LineChart>
              </ResponsiveContainer>
            </Card>





 <TabPane tab="Overview" key="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Platform Performance */}
            <Card title="Platform Distribution" className="bg-gray-800 border-gray-700">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(getAggregateData(filteredData).platformTotals).map(([name, value]) => ({
                      name,
                      value,
                      color: platformColors[name.toLowerCase()],
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.entries(getAggregateData(filteredData).platformTotals).map(([name], index) => (
                      <Cell key={`cell-${index}`} fill={platformColors[name.toLowerCase()]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Difficulty Distribution */}
            <Card title="LeetCode Difficulty Breakdown" className="bg-gray-800 border-gray-700">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[getAggregateData(filteredData).difficultyTotals]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="easy" stackId="a" fill={difficultyColors.easy} name="Easy" />
                  <Bar dataKey="medium" stackId="a" fill={difficultyColors.medium} name="Medium" />
                  <Bar dataKey="hard" stackId="a" fill={difficultyColors.hard} name="Hard" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Rating Distribution */}
            <Card title="Codeforces Rating Distribution" className="bg-gray-800 border-gray-700">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[getAggregateData(filteredData).ratingDistribution]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pupil" fill="#3498db" name="Pupil" />
                  <Bar dataKey="specialist" fill="#2ecc71" name="Specialist" />
                  <Bar dataKey="expert" fill="#9b59b6" name="Expert" />
                  <Bar dataKey="master" fill="#e74c3c" name="Master" />
                  <Bar dataKey="other" fill="#f39c12" name="Other" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            {/* Growth Over Time */}
            <Card title="Average Performance Over Time" className="bg-gray-800 border-gray-700">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={filteredData.flatMap(prepareTrendData)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                  <Line type="monotone" dataKey="lcTotal" stroke="#FFA116" name="LeetCode" />
                  <Line type="monotone" dataKey="cfTotal" stroke="#1F8ACB" name="Codeforces" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabPane>