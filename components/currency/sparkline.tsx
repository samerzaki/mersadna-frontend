"use client";

import React from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 60,
  height = 20,
  strokeWidth = 1.5,
  className = "",
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div
        className={className}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  }

  // Normalize data to fit within the SVG viewBox
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  // Calculate points for the line
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  // Create path string
  const pathData = `M ${points.join(" L ")}`;

  // Determine color based on trend
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const isPositive = lastValue > firstValue;
  const strokeColor = isPositive ? "#16a34a" : "#dc2626"; // green-600 : red-600

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
