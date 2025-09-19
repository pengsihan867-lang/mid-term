import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Coins, Users } from 'lucide-react';

const SolarCoinDashboard = ({ transactions }) => {
  const prosumerBalances = useMemo(() => {
    if (!transactions || transactions.length === 0) return {};

    const balances = {};
    
    transactions.forEach(transaction => {
      const { seller, buyer, energy_kWh } = transaction;
      
      // 卖方获得SolarCoin (正数)
      if (!balances[seller]) {
        balances[seller] = { 
          totalSold: 0, 
          totalBought: 0, 
          netBalance: 0,
          transactionCount: 0,
          totalValue: 0
        };
      }
      balances[seller].totalSold += energy_kWh;
      balances[seller].netBalance += energy_kWh;
      balances[seller].transactionCount += 1;
      balances[seller].totalValue += transaction.total_value;
      
      // 买方失去SolarCoin (负数)
      if (!balances[buyer]) {
        balances[buyer] = { 
          totalSold: 0, 
          totalBought: 0, 
          netBalance: 0,
          transactionCount: 0,
          totalValue: 0
        };
      }
      balances[buyer].totalBought += energy_kWh;
      balances[buyer].netBalance -= energy_kWh;
      balances[buyer].transactionCount += 1;
      balances[buyer].totalValue -= transaction.total_value;
    });

    return balances;
  }, [transactions]);

  const summaryStats = useMemo(() => {
    const prosumers = Object.keys(prosumerBalances);
    const totalEnergyTraded = Object.values(prosumerBalances).reduce((sum, p) => sum + p.totalSold, 0);
    const totalValue = Object.values(prosumerBalances).reduce((sum, p) => sum + Math.abs(p.totalValue), 0) / 2; // 除以2避免重复计算
    const positiveBalances = Object.values(prosumerBalances).filter(p => p.netBalance > 0).length;
    const negativeBalances = Object.values(prosumerBalances).filter(p => p.netBalance < 0).length;

    return {
      totalProsumers: prosumers.length,
      totalEnergyTraded,
      totalValue,
      positiveBalances,
      negativeBalances
    };
  }, [prosumerBalances]);

  const sortedProsumers = useMemo(() => {
    return Object.entries(prosumerBalances)
      .sort(([,a], [,b]) => b.netBalance - a.netBalance);
  }, [prosumerBalances]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无SolarCoin数据
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            请先上传交易数据以查看SolarCoin余额
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 概览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">参与方数量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaryStats.totalProsumers}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Coins className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总交易能量</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaryStats.totalEnergyTraded.toFixed(2)} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Wallet className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">总交易价值</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${summaryStats.totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">净收益方</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summaryStats.positiveBalances}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SolarCoin余额卡片 */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="w-6 h-6 text-solar-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            SolarCoin余额
          </h2>
          <div className="bg-solar-100 dark:bg-solar-900 text-solar-800 dark:text-solar-200 px-3 py-1 rounded-full text-sm font-medium">
            1 kWh = 1 SolarCoin
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProsumers.map(([prosumer, data]) => (
            <div
              key={prosumer}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                data.netBalance > 0
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : data.netBalance < 0
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    data.netBalance > 0 ? 'bg-green-500' : 
                    data.netBalance < 0 ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {prosumer}
                  </span>
                </div>
                {data.netBalance > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : data.netBalance < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">净余额</span>
                  <span className={`font-bold text-lg ${
                    data.netBalance > 0 ? 'text-green-600' : 
                    data.netBalance < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {data.netBalance > 0 ? '+' : ''}{data.netBalance.toFixed(4)} SC
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">卖出</span>
                  <span className="text-green-600 font-medium">
                    +{data.totalSold.toFixed(4)} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">买入</span>
                  <span className="text-red-600 font-medium">
                    -{data.totalBought.toFixed(4)} kWh
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">交易次数</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {data.transactionCount}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">净价值</span>
                  <span className={`font-medium ${
                    data.totalValue > 0 ? 'text-green-600' : 
                    data.totalValue < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {data.totalValue > 0 ? '+' : ''}${data.totalValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarCoinDashboard;
