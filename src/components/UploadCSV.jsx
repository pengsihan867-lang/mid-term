import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

const UploadCSV = ({ onDataLoaded, onError }) => {
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      onError('请上传CSV文件');
      return;
    }
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          onError(`解析CSV时出错: ${results.errors[0].message}`);
          return;
        }
        
        // 验证CSV格式
        const requiredColumns = ['timestamp', 'seller', 'buyer', 'energy_kWh', 'price_per_kWh'];
        const headers = Object.keys(results.data[0] || {});
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          onError(`CSV文件缺少必需的列: ${missingColumns.join(', ')}`);
          return;
        }
        
        // 处理数据
        const processedData = results.data.map((row, index) => ({
          id: index,
          timestamp: row.timestamp,
          seller: row.seller.trim(),
          buyer: row.buyer.trim(),
          energy_kWh: parseFloat(row.energy_kWh) || 0,
          price_per_kWh: parseFloat(row.price_per_kWh) || 0,
          total_value: (parseFloat(row.energy_kWh) || 0) * (parseFloat(row.price_per_kWh) || 0)
        }));
        
        onDataLoaded(processedData);
      },
      error: (error) => {
        onError(`文件读取失败: ${error.message}`);
      }
    });
  }, [onDataLoaded, onError]);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          上传交易数据
        </h2>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            拖拽CSV文件到此处或点击选择文件
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            支持格式: timestamp, seller, buyer, energy_kWh, price_per_kWh
          </p>
        </div>
        
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        
        <label
          htmlFor="csv-upload"
          className="btn-primary inline-block mt-4 cursor-pointer"
        >
          选择CSV文件
        </label>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">文件格式要求:</p>
            <ul className="space-y-1 text-xs">
              <li>• 第一行必须包含列标题</li>
              <li>• 时间戳格式: YYYY-MM-DDTHH:MM:SS</li>
              <li>• 卖方和买方: P1, P2, P3等</li>
              <li>• 能量单位: kWh (数值)</li>
              <li>• 价格单位: $/kWh (数值)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
