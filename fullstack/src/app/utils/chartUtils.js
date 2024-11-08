import React from 'react';
import { parseISO, format } from 'date-fns';

export function calculateYAxisConfig(data, dataKey, minRange = 0, maxRange = 1000) {
  if (!data || data.length === 0) {
    return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] }; // Fallback for empty data
  }

  const values = data.map((item) => item[dataKey]);

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  // Allow dynamic scaling based on the provided min and max range
  const adjustedMinValue = Math.max(minValue, minRange);
  const adjustedMaxValue = Math.min(maxValue, maxRange);

  // Calculate the magnitude for legible scaling
  const magnitude = Math.pow(10, Math.floor(Math.log10(adjustedMaxValue || 1)));
  
  // Dynamic step size calculation
  let stepSize = Math.ceil((adjustedMaxValue - adjustedMinValue) / 10); 
  if (stepSize < magnitude / 2) stepSize = Math.ceil(magnitude / 2); 
  
  // Calculate the adjusted maxY and minY
  const maxY = Math.ceil(adjustedMaxValue / stepSize) * stepSize;
  const minY = Math.floor(adjustedMinValue / stepSize) * stepSize;

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

// Custom tick component for displaying date and day
export const CustomXAxisTick = ({ x, y, payload, viewType, color }) => {
  try {
    let displayDate = payload.value;
    if (viewType === 'hourly') {
      // For hourly, format as "11am, 12pm"
      const time = new Date(displayDate);
      displayDate = format(time, 'haaa');
    } else {
      // For daily, format as "dd/MM" on the first line and "EEE" on the second line
      const date = parseISO(payload.value);
      const formattedDate = format(date, 'dd/MM');
      const formattedDay = format(date, 'EEE');
      displayDate = (
        <>
          <tspan x={0} dy="1em">
            {formattedDate}
          </tspan>
          <tspan x={0} dy="1em">
            {formattedDay}
          </tspan>
        </>
      );
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={10}
          textAnchor="end"
          fill={color}
          fontSize={10}
          transform="rotate(-45)"
        >
          {displayDate}
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
