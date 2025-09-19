# P2P交易可视化器 - SolarCoin余额分析系统

一个基于React + Vite + Tailwind构建的现代化Web应用，用于可视化P2P能源交易数据并分析SolarCoin余额。

## 🌟 功能特性

### 📊 数据上传与解析
- 支持CSV文件上传（使用PapaParse解析）
- 自动验证数据格式和必需列
- 实时错误提示和数据验证

### 💰 SolarCoin余额分析
- **1 kWh = 1 SolarCoin** 的转换规则
- 实时计算每个参与方的净余额
- 可视化显示买卖交易统计
- 支持正负余额的直观展示

### 📈 数据可视化
- **交易记录表格**: 支持搜索、排序、分页
- **网络图**: D3.js力导向图显示交易关系
- **图表分析**: Recharts多维度数据图表
  - 每小时交易能量趋势
  - SolarCoin余额排行
  - 交易对分布饼图
  - 交易统计柱状图

### 🎨 用户体验
- 响应式设计，支持移动端
- 深色/浅色主题切换
- 现代化UI设计（TailwindCSS）
- 直观的交互和动画效果

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/
│   ├── UploadCSV.jsx          # CSV文件上传组件
│   ├── TransactionsTable.jsx  # 交易数据表格
│   ├── SolarCoinDashboard.jsx # SolarCoin余额仪表板
│   ├── NetworkGraph.jsx       # D3.js网络图
│   └── Charts.jsx             # Recharts图表组件
├── App.jsx                    # 主应用组件
├── main.jsx                   # 应用入口
└── index.css                  # 全局样式
```

## 📋 CSV数据格式

上传的CSV文件必须包含以下列：

| 列名 | 类型 | 描述 | 示例 |
|------|------|------|------|
| timestamp | string | 交易时间戳 | 2019-01-02T08:05:00 |
| seller | string | 卖方标识 | P1 |
| buyer | string | 买方标识 | P2 |
| energy_kWh | number | 交易能量(kWh) | 1.2 |
| price_per_kWh | number | 单价($/kWh) | 0.15 |

### 示例数据
```csv
timestamp,seller,buyer,energy_kWh,price_per_kWh
2019-01-02T08:05:00,P1,P2,1.2,0.15
2019-01-02T08:10:00,P2,P3,0.8,0.12
```

## 🔧 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: TailwindCSS
- **数据解析**: PapaParse
- **图表库**: Recharts
- **网络图**: D3.js
- **图标**: Lucide React

## 🌐 部署

### GitHub Pages
项目已配置GitHub Actions自动部署到GitHub Pages：

1. 推送代码到main分支
2. GitHub Actions自动构建和部署
3. 访问 `https://yourusername.github.io/p2p-trading-visualizer/`

### 其他平台
构建后的文件在 `dist/` 目录，可以部署到任何静态文件托管服务。

## 📊 使用说明

1. **上传数据**: 在"上传数据"标签页选择CSV文件
2. **查看概览**: 在"概览"标签页查看SolarCoin余额统计
3. **浏览交易**: 在"交易记录"标签页查看详细交易数据
4. **分析网络**: 在"网络图"标签页查看交易关系图
5. **图表分析**: 在"图表分析"标签页查看多维度图表

## 🎯 SolarCoin计算规则

- **卖方**: 每卖出1 kWh获得1 SolarCoin
- **买方**: 每买入1 kWh消耗1 SolarCoin
- **净余额**: 卖出总量 - 买入总量
- **正余额**: 净收益方（绿色显示）
- **负余额**: 净支出方（红色显示）

## 🔍 功能亮点

### 智能数据验证
- 自动检测CSV格式和必需列
- 实时数据验证和错误提示
- 支持多种时间戳格式

### 交互式网络图
- 拖拽节点调整布局
- 悬停显示详细信息
- 连接线宽度表示交易量
- 节点大小表示活跃度

### 响应式设计
- 移动端友好的界面
- 自适应图表和表格
- 触摸设备支持

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

---

**注意**: 这是一个演示项目，用于展示P2P能源交易数据的可视化分析。在实际应用中，请确保数据安全和隐私保护。
