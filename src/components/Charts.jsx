import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const Charts = ({ transactions }) => {
  // 按小时统计交易数据
  const hourlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const hourlyMap = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      const hour = date.getHours();
      const key = `${date.getMonth() + 1}/${date.getDate()} ${hour}:00`;
      
      if (!hourlyMap[key]) {
        hourlyMap[key] = {
          hour: key,
          energy: 0,
          value: 0,
          count: 0
        };
      }
      
      hourlyMap[key].energy += transaction.energy_kWh;
      hourlyMap[key].value += transaction.total_value;
      hourlyMap[key].count += 1;
    });

    return Object.values(hourlyMap).sort((a, b) => {
      const [aDate, aTime] = a.hour.split(' ');
      const [bDate, bTime] = b.hour.split(' ');
      if (aDate !== bDate) return aDate.localeCompare(bDate);
      return aTime.localeCompare(bTime);
    });
  }, [transactions]);

  // SolarCoin余额数据
  const balanceData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const balances = {};
    
    transactions.forEach(transaction => {
      const { seller, buyer, energy_kWh } = transaction;
      
      if (!balances[seller]) {
        balances[seller] = { name: seller, balance: 0, energy: 0 };
      }
      balances[seller].balance += energy_kWh;
      balances[seller].energy += energy_kWh;
      
      if (!balances[buyer]) {
        balances[buyer] = { name: buyer, balance: 0, energy: 0 };
      }
      balances[buyer].balance -= energy_kWh;
      balances[buyer].energy += energy_kWh;
    });

    return Object.values(balances)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10); // 只显示前10个
  }, [transactions]);

  // 交易分布饼图数据
  const transactionDistribution = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const distribution = {};
    
    transactions.forEach(transaction => {
      const { seller, buyer } = transaction;
      const pair = `${seller} → ${buyer}`;
      
      if (!distribution[pair]) {
        distribution[pair] = { name: pair, value: 0, count: 0 };
      }
      distribution[pair].value += transaction.energy_kWh;
      distribution[pair].count += 1;
    });

    return Object.values(distribution)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // 只显示前8个
  }, [transactions]);

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1'
  ];

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无图表数据
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            请先上传交易数据以查看图表
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 每小时交易能量趋势 */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            每小时交易能量趋势
          </h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: '能量 (kWh)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value.toFixed(4)} ${name === 'energy' ? 'kWh' : name === 'value' ? '$' : '笔'}`,
                  name === 'energy' ? '能量' : name === 'value' ? '价值' : '交易数'
                ]}
                labelFormatter={(label) => `时间: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SolarCoin余额排行 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              SolarCoin余额排行
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'SolarCoin余额', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(4)} ${name === 'balance' ? 'SC' : 'kWh'}`,
                    name === 'balance' ? 'SolarCoin余额' : '总交易能量'
                  ]}
                  labelFormatter={(label) => `参与方: ${label}`}
                />
                <Bar 
                  dataKey="balance" 
                  fill="#10B981"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 交易分布饼图 */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              交易对分布
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name.split(' → ')[0]}→${name.split(' → ')[1]} (${(percent * 100).toFixed(1)}%)`}
                  labelLine={false}
                >
                  {transactionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    `${value.toFixed(4)} kWh`,
                    '交易能量'
                  ]}
                  labelFormatter={(label) => `交易对: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 每小时交易统计 */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            每小时交易统计
          </h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: '交易数量', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} ${name === 'count' ? '笔' : name === 'value' ? '$' : 'kWh'}`,
                  name === 'count' ? '交易数' : name === 'value' ? '价值' : '能量'
                ]}
                labelFormatter={(label) => `时间: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
