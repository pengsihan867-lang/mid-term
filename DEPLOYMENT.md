# 部署指南

## 🚀 GitHub Pages 部署

### 1. 创建GitHub仓库
```bash
# 初始化Git仓库
git init
git add .
git commit -m "Initial commit: P2P交易可视化器"

# 添加远程仓库（替换为你的仓库URL）
git remote add origin https://github.com/yourusername/p2p-trading-visualizer.git
git branch -M main
git push -u origin main
```

### 2. 启用GitHub Pages
1. 进入仓库的 Settings 页面
2. 滚动到 "Pages" 部分
3. 在 "Source" 下选择 "GitHub Actions"
4. 推送代码到main分支，GitHub Actions会自动构建和部署

### 3. 访问应用
部署完成后，应用将在以下URL可用：
```
https://yourusername.github.io/p2p-trading-visualizer/
```

## 🔧 本地开发

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
应用将在 http://localhost:5173 运行

### 构建生产版本
```bash
npm run build
```
构建文件将输出到 `dist/` 目录

## 📁 项目文件说明

```
p2p-trading-visualizer/
├── .github/workflows/deploy.yml  # GitHub Actions部署配置
├── public/                       # 静态资源
├── src/
│   ├── components/              # React组件
│   │   ├── UploadCSV.jsx       # CSV上传组件
│   │   ├── TransactionsTable.jsx # 交易表格
│   │   ├── SolarCoinDashboard.jsx # SolarCoin仪表板
│   │   ├── NetworkGraph.jsx    # D3.js网络图
│   │   └── Charts.jsx          # Recharts图表
│   ├── App.jsx                 # 主应用
│   ├── main.jsx               # 入口文件
│   └── index.css              # 全局样式
├── package.json               # 项目配置
├── vite.config.js            # Vite配置
├── tailwind.config.js        # Tailwind配置
├── sample_data.csv           # 示例数据
└── README.md                 # 项目说明
```

## 🎯 功能测试

### 1. 上传测试数据
使用项目根目录的 `sample_data.csv` 文件进行测试：
- 包含16笔P2P交易记录
- 涉及P1、P2、P3三个参与方
- 时间跨度：2019-01-02 08:05 - 13:15

### 2. 验证功能
- ✅ CSV文件上传和解析
- ✅ SolarCoin余额计算
- ✅ 交易记录表格显示
- ✅ 网络图可视化
- ✅ 多维度图表分析
- ✅ 深色/浅色主题切换
- ✅ 响应式设计

## 🔍 故障排除

### 构建失败
```bash
# 清除缓存并重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 开发服务器无法启动
```bash
# 检查端口是否被占用
lsof -ti:5173
# 杀死占用进程
kill -9 $(lsof -ti:5173)
# 重新启动
npm run dev
```

### GitHub Pages部署失败
1. 检查 `.github/workflows/deploy.yml` 文件
2. 确保仓库有 `GITHUB_TOKEN` 权限
3. 查看 Actions 页面的错误日志

## 📊 性能优化

### 代码分割
当前构建包较大（653KB），可以通过以下方式优化：
1. 使用动态导入分割组件
2. 配置 Vite 的 manualChunks
3. 懒加载非关键组件

### 示例配置
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'd3': ['d3'],
          'recharts': ['recharts'],
          'papaparse': ['papaparse']
        }
      }
    }
  }
})
```

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 移动端支持

应用已针对移动端优化：
- 响应式布局
- 触摸友好的交互
- 自适应图表和表格
- 移动端导航

## 🔒 安全注意事项

- 所有数据处理都在客户端进行
- 不上传数据到服务器
- 支持本地数据隐私保护
- 建议在生产环境中添加HTTPS
