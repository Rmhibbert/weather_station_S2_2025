import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { calculateYAxisConfig } from '../../app/utils/chartUtils';
import { parseISO, format } from 'date-fns';

// Custom tick component for displaying date and day
const CustomXAxisTick = ({ x, y, payload }) => {
  try {
    const date = parseISO(payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={10} textAnchor="end" fill="#113f67" fontSize={10} transform="rotate(-45)">
          <tspan x={0} dy="1em">{format(date, 'dd/MM')}</tspan>
          <tspan x={0} dy="1em">{format(date, 'EEE')}</tspan>
        </text>
      </g>
    );
  } catch (error) {
    console.error('Error formatting date:', error, 'Original value:', payload.value);
    return null;
  }
};

const LineChartComponent = ({ data, datakey, viewType }) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(
    window.innerWidth <= 1060,
  );
  const graphColor = '#113f67';

  useEffect(() => {
    const handleResize = () => {
      setIsScrollEnabled(window.innerWidth <= 1060);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { domain, ticks } = calculateYAxisConfig(data, datakey);

  const xAxisDataKey = viewType === 'hourly' ? 'hour' : 'day';

  // Ensure data is valid and sorted
  const dateKey = viewType === 'hourly' ? 'hour' : 'day';
  const validData = data.filter(
    (item) => item[dateKey] !== undefined && item[dateKey] !== null,
  );

  const sortedData = validData.slice().sort((a, b) => {
    const dateA = parseISO(a[dateKey]);
    const dateB = parseISO(b[dateKey]);
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
  });

  // Slice data based on the viewType without changing its order
  const filteredData = sortedData.slice(viewType === 'hourly' ? -24 : -30);

  // Adjust container width for scroll functionality
  const containerWidth =
    isScrollEnabled && viewType !== '7days'
      ? `${filteredData.length * 50}px` // Adjust width based on the data length for scrolling
      : '100%';

  const formatXAxis = (tick) => {
    if (!tick) return 'No Data';
    try {
      const date = parseISO(tick);
      return `${format(date, 'dd/MM')} (${format(date, 'EEE')})`;
    } catch (error) {
      console.error('Error formatting date:', error, 'Original tick:', tick);
      return 'Invalid Date';
    }
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        marginTop: '10px',
        overflowX:
          isScrollEnabled && viewType !== '7days' ? 'scroll' : 'hidden',
      }}
    >
      <div style={{ width: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 22, left: 0, bottom: 15 }} 
          >
            <CartesianGrid stroke="white" strokeDasharray="5 5" />
            <XAxis
              dataKey={xAxisDataKey}
              stroke={graphColor}
              tick={<CustomXAxisTick />}
              tickLine={{ transform: 'translateY(5px)' }}
              tickFormatter={formatXAxis}
              textAnchor="end"
              angle={-45}
              dy={10}
            />
            <YAxis
              type="number"
              domain={domain}
              ticks={ticks}
              stroke={graphColor}
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: graphColor,
                borderRadius: '8px',
                padding: '5px',
              }}
              itemStyle={{ color: graphColor }}
              labelFormatter={() => ''}
            />
            <Line
              type="monotone"
              dataKey="avg_value"
              stroke={graphColor}
              strokeWidth={2}
              dot={{ fill: graphColor, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;
