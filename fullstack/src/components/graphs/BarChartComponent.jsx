import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
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

const BarChartComponent = ({ data, datakey, viewType }) => {
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
  const validData = data.filter(
    (item) => item[xAxisDataKey] !== undefined && item[xAxisDataKey] !== null,
  );

  const sortedData = validData.slice().sort((a, b) => {
    const dateA = parseISO(a[xAxisDataKey]);
    const dateB = parseISO(b[xAxisDataKey]);
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
  });

  const filteredData = sortedData.slice(viewType === 'hourly' ? -24 : -30);

  // Adjust container width based on view type to prevent squishing for the 7-day view
  const containerWidth =
    viewType !== '7days' && isScrollEnabled
      ? `${Math.max(filteredData.length * 50, window.innerWidth)}px`
      : '100%';

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        marginTop: '10px',
        overflowX:
          viewType !== '7days' && isScrollEnabled ? 'scroll' : 'hidden',
      }}
    >
      <div style={{ width: containerWidth }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 22, left: 0, bottom: 15 }}
          >
            <CartesianGrid stroke="white" strokeDasharray="5 5" />
            <XAxis
              dataKey={xAxisDataKey}
              stroke={graphColor}
              tick={<CustomXAxisTick />}
              interval={0}
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
            <Bar dataKey={datakey} fill={graphColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
