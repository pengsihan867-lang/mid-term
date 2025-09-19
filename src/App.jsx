import React, { useState, useEffect } from 'react';
import { Sun, Moon, Coins, BarChart3, Table, Network, Upload } from 'lucide-react';
import UploadCSV from './components/UploadCSV';
import TransactionsTable from './components/TransactionsTable';
import SolarCoinDashboard from './components/SolarCoinDashboard';
import NetworkGraph from './components/NetworkGraph';
import Charts from './components/Charts';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 处理数据加载
  const handleDataLoaded = (data) => {
    setTransactions(data);
    setError('');
    setActiveTab('overview');
  };

  // 处理错误
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setTransactions([]);
  };

  // 清除数据
  const clearData = () => {
    setTransactions([]);
    setError('');
    setActiveTab('upload');
  };

  const tabs = [
    { id: 'upload', label: '上传数据', icon: Upload },
    { id: 'overview', label: '概览', icon: BarChart3 },
    { id: 'transactions', label: '交易记录', icon: Table },
    { id: 'network', label: '网络图', icon: Network },
    { id: 'charts', label: '图表分析', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* 头部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-solar-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  P2P交易可视化器
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  SolarCoin余额分析系统
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {transactions.length > 0 && (
                <button
                  onClick={clearData}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  清除数据
                </button>
              )}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 标签导航 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-solar-500 text-solar-600 dark:text-solar-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">错误:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 标签内容 */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <UploadCSV onDataLoaded={handleDataLoaded} onError={handleError} />
            
            {transactions.length > 0 && (
              <div className="card">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    数据加载成功！
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    已加载 {transactions.length} 笔交易记录
                  </p>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="btn-primary"
                  >
                    查看分析结果
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && transactions.length > 0 && (
          <div className="space-y-6">
            <SolarCoinDashboard transactions={transactions} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionsTable transactions={transactions} />
        )}

        {activeTab === 'network' && (
          <NetworkGraph transactions={transactions} />
        )}

        {activeTab === 'charts' && (
          <Charts transactions={transactions} />
        )}

        {/* 空状态 */}
        {activeTab !== 'upload' && transactions.length === 0 && (
          <div className="card">
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                请先上传数据
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                上传CSV文件以开始分析P2P交易数据
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="btn-primary"
              >
                上传数据
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              P2P交易可视化器 - 基于React + Vite + Tailwind构建
            </p>
            <p className="text-sm">
              支持CSV文件上传，实时分析SolarCoin余额和交易网络
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
