"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";

interface ChartDataPoint {
  date: string;
  dateKey: string;
  revenue: number;
  websiteRevenue: number;
  walkInRevenue: number;
  orderCount: number;
}

interface SalesChartProps {
  data: ChartDataPoint[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const [activeTab, setActiveTab] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 600;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute maximum values for scaling
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 10);
  const maxOrders = Math.max(...data.map((d) => d.orderCount), 5);
  const maxVal = activeTab === "revenue" ? maxRevenue : maxOrders;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const val = activeTab === "revenue" ? d.revenue : d.orderCount;
    const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
    return { x, y, value: val, ...d };
  });

  // SVG Line path definition (using a smooth curve or polyline)
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Gradient area path definition
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : "";

  // Grid lines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }).map((_, i) => {
    const ratio = i / gridCount;
    const y = paddingTop + ratio * chartHeight;
    const value = maxVal - ratio * maxVal;
    return { y, value };
  });

  return (
    <div className="bg-white border border-[#e8dfd7] rounded-2xl p-6 shadow-sm space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#f2ede4] pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#2d1e18]">7-Day Sales Trend</h3>
          <p className="text-[11px] text-[#705e55] font-medium">Daily order volumes and performance statistics.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#f2ede4] p-1 rounded-xl border border-[#e8dfd7] text-xs font-semibold">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`rounded-lg px-4 py-2 transition-all ${
              activeTab === "revenue"
                ? "bg-white text-[#2d1e18] shadow-sm font-bold"
                : "text-[#705e55] hover:text-[#2d1e18]"
            }`}
          >
            Revenue (₹)
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`rounded-lg px-4 py-2 transition-all ${
              activeTab === "orders"
                ? "bg-white text-[#2d1e18] shadow-sm font-bold"
                : "text-[#705e55] hover:text-[#2d1e18]"
            }`}
          >
            Orders Count
          </button>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-visible">
          <defs>
            {/* Primary line gradient fill */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="barGradWeb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c6239" />
              <stop offset="100%" stopColor="#734f2d" />
            </linearGradient>
            <linearGradient id="barGradWalk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridLines.map((gl, i) => (
            <g key={i} className="opacity-70">
              <line
                x1={paddingLeft}
                y1={gl.y}
                x2={width - paddingRight}
                y2={gl.y}
                stroke="#e8dfd7"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 10}
                y={gl.y + 4}
                className="text-[9px] font-bold font-sans fill-[#705e55] text-right"
                style={{ textAnchor: "end" }}
              >
                {activeTab === "revenue" ? `₹${gl.value.toFixed(0)}` : gl.value.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Bar Chart overlay for Revenue breakdown */}
          {activeTab === "revenue" &&
            data.map((d, i) => {
              const xPos = paddingLeft + (i / (data.length - 1)) * chartWidth;
              const barWidth = Math.min(18, chartWidth / data.length - 12);
              
              // Scale heights
              const webHeight = (d.websiteRevenue / maxVal) * chartHeight;
              const walkHeight = (d.walkInRevenue / maxVal) * chartHeight;
              
              // Draw stacked bars
              const yWeb = paddingTop + chartHeight - webHeight;
              const yWalk = yWeb - walkHeight;

              return (
                <g key={i} className="transition-all duration-300">
                  {/* Website Revenue bar segment */}
                  {webHeight > 0 && (
                    <rect
                      x={xPos - barWidth / 2}
                      y={yWeb}
                      width={barWidth}
                      height={webHeight}
                      fill="url(#barGradWeb)"
                      rx="3"
                      className="transition-all duration-300"
                    />
                  )}
                  {/* Walk-in Revenue bar segment */}
                  {walkHeight > 0 && (
                    <rect
                      x={xPos - barWidth / 2}
                      y={yWalk}
                      width={barWidth}
                      height={walkHeight}
                      fill="url(#barGradWalk)"
                      rx="3"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Hover detector overlay */}
                  <rect
                    x={xPos - chartWidth / (data.length - 1) / 2}
                    y={paddingTop}
                    width={chartWidth / (data.length - 1)}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              );
            })}

          {/* Line Chart for total revenue/orders */}
          {activeTab === "orders" && (
            <>
              {/* Gradient Area under line */}
              <path d={areaPath} fill="url(#areaGrad)" />
              {/* Line path */}
              <path
                d={linePath}
                fill="none"
                stroke="#d97706"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data circles and hover detectors */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIndex === i ? "6" : "4.5"}
                    fill={hoveredIndex === i ? "#b45309" : "#d97706"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                  {/* Hover detection target */}
                  <rect
                    x={p.x - chartWidth / (data.length - 1) / 2}
                    y={paddingTop}
                    width={chartWidth / (data.length - 1)}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              ))}
            </>
          )}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={paddingTop + chartHeight + 18}
                className={`text-[9px] font-bold uppercase tracking-wider fill-[#705e55] text-center`}
                style={{ textAnchor: "middle" }}
              >
                {d.date}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-10 bg-[#1d140e] text-[#faf8f5] text-[10px] p-3 rounded-xl shadow-lg border border-[#2c1e15] w-48 leading-relaxed space-y-1.5 transition-all duration-200 pointer-events-none"
            style={{
              left: `${Math.min(
                width - 200,
                Math.max(
                  10,
                  paddingLeft +
                    (hoveredIndex / (data.length - 1)) * chartWidth -
                    90
                )
              ) * (100 / width)}%`,
              top: `${Math.max(
                10,
                (points[hoveredIndex].y - 95) * (100 / height)
              )}%`,
            }}
          >
            <div className="font-bold border-b border-[#2c1e15] pb-1 uppercase tracking-wider flex justify-between">
              <span>{points[hoveredIndex].date}</span>
              <span className="text-amber-400">Trend</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a49187]">Total Sales:</span>
              <span className="font-bold">{formatCurrency(data[hoveredIndex].revenue)}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] pl-1.5 border-l-2 border-[#8c6239]">
              <span className="text-[#a49187]">💻 Website:</span>
              <span className="font-bold text-[#faf8f5]">{formatCurrency(data[hoveredIndex].websiteRevenue)}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] pl-1.5 border-l-2 border-[#d97706]">
              <span className="text-[#a49187]">🏪 Walk-in:</span>
              <span className="font-bold text-[#faf8f5]">{formatCurrency(data[hoveredIndex].walkInRevenue)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#2c1e15]">
              <span className="text-[#a49187]">Total Orders:</span>
              <span className="font-bold">{data[hoveredIndex].orderCount} orders</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      {activeTab === "revenue" && (
        <div className="flex items-center justify-center space-x-6 text-[10px] font-bold uppercase tracking-wider text-[#705e55]">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded bg-[#8c6239] block"></span>
            <span>Website Orders</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded bg-[#d97706] block"></span>
            <span>Walk-in Orders</span>
          </div>
        </div>
      )}
    </div>
  );
}
