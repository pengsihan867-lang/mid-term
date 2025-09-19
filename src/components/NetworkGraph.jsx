import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Network, ArrowRight } from 'lucide-react';

const NetworkGraph = ({ transactions }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  const graphData = useMemo(() => {
    if (!transactions || transactions.length === 0) return { nodes: [], links: [] };

    const nodes = new Map();
    const links = [];

    // 处理交易数据
    transactions.forEach(transaction => {
      const { seller, buyer, energy_kWh, price_per_kWh } = transaction;
      
      // 添加卖方节点
      if (!nodes.has(seller)) {
        nodes.set(seller, {
          id: seller,
          name: seller,
          totalSold: 0,
          totalBought: 0,
          netBalance: 0,
          transactionCount: 0
        });
      }
      nodes.get(seller).totalSold += energy_kWh;
      nodes.get(seller).netBalance += energy_kWh;
      nodes.get(seller).transactionCount += 1;

      // 添加买方节点
      if (!nodes.has(buyer)) {
        nodes.set(buyer, {
          id: buyer,
          name: buyer,
          totalSold: 0,
          totalBought: 0,
          netBalance: 0,
          transactionCount: 0
        });
      }
      nodes.get(buyer).totalBought += energy_kWh;
      nodes.get(buyer).netBalance -= energy_kWh;
      nodes.get(buyer).transactionCount += 1;

      // 添加连接
      const existingLink = links.find(link => 
        link.source === seller && link.target === buyer
      );
      
      if (existingLink) {
        existingLink.energy += energy_kWh;
        existingLink.value += energy_kWh * price_per_kWh;
        existingLink.count += 1;
      } else {
        links.push({
          source: seller,
          target: buyer,
          energy: energy_kWh,
          value: energy_kWh * price_per_kWh,
          count: 1
        });
      }
    });

    return {
      nodes: Array.from(nodes.values()),
      links: links
    };
  }, [transactions]);

  useEffect(() => {
    if (!graphData.nodes.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(400, Math.min(600, width * 0.6));

    svg.attr("width", width).attr("height", height);

    // 创建力导向图
    const simulation = d3.forceSimulation(graphData.nodes)
      .force("link", d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(100)
        .strength(0.1)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // 创建箭头标记
    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 8)
      .attr("refY", 3)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0 L0,6 L9,3 z")
      .attr("fill", "#6B7280");

    // 创建连接线
    const link = svg.append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter().append("line")
      .attr("stroke", "#6B7280")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.max(1, Math.sqrt(d.energy) * 2))
      .attr("marker-end", "url(#arrowhead)");

    // 创建节点
    const node = svg.append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // 节点圆圈
    node.append("circle")
      .attr("r", d => Math.max(15, Math.min(40, Math.sqrt(d.transactionCount) * 3)))
      .attr("fill", d => d.netBalance > 0 ? "#10B981" : d.netBalance < 0 ? "#EF4444" : "#6B7280")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // 节点标签
    node.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .text(d => d.name);

    // 添加工具提示
    const tooltip = d3.select("body").append("div")
      .attr("class", "fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none opacity-0 transition-opacity duration-200")
      .style("font-family", "system-ui, sans-serif");

    node
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle")
          .attr("stroke", "#3B82F6")
          .attr("stroke-width", 3);
        
        tooltip
          .html(`
            <div class="font-bold mb-1">${d.name}</div>
            <div>净余额: ${d.netBalance > 0 ? '+' : ''}${d.netBalance.toFixed(2)} SC</div>
            <div>卖出: ${d.totalSold.toFixed(2)} kWh</div>
            <div>买入: ${d.totalBought.toFixed(2)} kWh</div>
            <div>交易次数: ${d.transactionCount}</div>
          `)
          .style("opacity", 1);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).select("circle")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2);
        
        tooltip.style("opacity", 0);
      });

    // 连接线工具提示
    link
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "#3B82F6")
          .attr("stroke-width", Math.max(2, Math.sqrt(d.energy) * 2 + 2));
        
        tooltip
          .html(`
            <div class="font-bold mb-1">${d.source.name} → ${d.target.name}</div>
            <div>能量: ${d.energy.toFixed(2)} kWh</div>
            <div>价值: $${d.value.toFixed(2)}</div>
            <div>交易次数: ${d.count}</div>
          `)
          .style("opacity", 1);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke", "#6B7280")
          .attr("stroke-width", Math.max(1, Math.sqrt(d.energy) * 2));
        
        tooltip.style("opacity", 0);
      });

    // 更新位置
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // 拖拽函数
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // 清理函数
    return () => {
      tooltip.remove();
    };
  }, [graphData]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无网络数据
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            请先上传交易数据以查看网络图
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Network className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          交易网络图
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>净收益方</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>净支出方</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>平衡方</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4" />
            <span>连接线宽度表示交易能量大小，颜色表示交易方向</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-400"></div>
            <span>节点大小表示交易活跃度，颜色表示SolarCoin净余额</span>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <svg ref={svgRef} className="w-full"></svg>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
