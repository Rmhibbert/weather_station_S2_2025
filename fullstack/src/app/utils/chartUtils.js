import React from 'react';
import { parseISO, format } from 'date-fns';

export function calculateYAxisConfig(data, dataKey) {
  if (!data || data.length === 0) {
    return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] }; // Fallback for empty data
  }

  const values = data.map((item) => item[dataKey]);
  const maxValue = Math.max(...values);
  const minY = 0;

  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  let stepSize = magnitude / 2; // Divide by 2 for better granularity
  const maxY = Math.ceil(maxValue / stepSize) * stepSize;

  const ticks = [];
  for (let i = minY; i <= maxY; i += stepSize) {
    ticks.push(i);
  }

  return {
    domain: [minY, maxY],
    ticks: ticks,
  };
}

export function filterAndSortData(data, xAxisDataKey, viewType) {
  const validData = data.filter(
    (item) => item[xAxisDataKey] !== undefined && item[xAxisDataKey] !== null,
  );

  const sortedData = validData.slice().sort((a, b) => {
    const dateA = parseISO(a[xAxisDataKey]);
    const dateB = parseISO(b[xAxisDataKey]);
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
  });

  return sortedData.slice(viewType === 'hourly' ? -24 : -30);
}

export function formatXAxisTick(tick) {
  if (!tick) return 'No Data';
  try {
    const date = parseISO(tick);
    return `${format(date, 'dd/MM')} (${format(date, 'EEE')})`;
  } catch (error) {
    console.error('Error formatting date:', error, 'Original tick:', tick);
    return 'Invalid Date';
  }
}

// Custom tick component for displaying date and day
export const CustomXAxisTick = ({ x, y, payload }) => {
  try {
    const date = parseISO(payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={10}
          textAnchor="end"
          fill="#113f67"
          fontSize={10}
          transform="rotate(-45)"
        >
          <tspan x={0} dy="1em">
            {format(date, 'dd/MM')}
          </tspan>
          <tspan x={0} dy="1em">
            {format(date, 'EEE')}
          </tspan>
        </text>
      </g>
    );
  } catch (error) {
    console.error(
      'Error formatting date:',
      error,
      'Original value:',
      payload.value,
    );
    return null;
  }
};
