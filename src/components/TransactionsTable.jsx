import React, { useState, useMemo } from 'react';
import { Table, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const TransactionsTable = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => 
      transaction.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.timestamp.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'timestamp') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, sortField, sortDirection]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const formatCurrency = (value) => {
    return `$${value.toFixed(4)}`;
  };

  const formatEnergy = (value) => {
    return `${value.toFixed(4)} kWh`;
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Table className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无交易数据
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            请先上传CSV文件以查看交易记录
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Table className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            交易记录
          </h2>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-medium">
            {transactions.length} 笔交易
          </span>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索卖方、买方或时间戳..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {[
                { key: 'timestamp', label: '时间戳' },
                { key: 'seller', label: '卖方' },
                { key: 'buyer', label: '买方' },
                { key: 'energy_kWh', label: '能量 (kWh)' },
                { key: 'price_per_kWh', label: '价格 ($/kWh)' },
                { key: 'total_value', label: '总价值 ($)' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortField === key ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {formatTimestamp(transaction.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {transaction.seller}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {transaction.buyer}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                  {formatEnergy(transaction.energy_kWh)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                  {formatCurrency(transaction.price_per_kWh)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-semibold">
                  {formatCurrency(transaction.total_value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            显示第 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} 条，
            共 {filteredAndSortedTransactions.length} 条记录
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              上一页
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
