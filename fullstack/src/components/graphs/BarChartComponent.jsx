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

const BarChartComponent = ({ data, datakey, viewType }) => {
  const [isScrollEnabled, setIsScrollEnabled] = useState(window.innerWidth <= 1060);
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
    viewType === '7days'
      ? '100%' // Ensure 7-day view is full width without scrolling
      : isScrollEnabled
        ? `${filteredData.length * 50}px` // Enable scroll for hourly and 30-day views
        : '100%';

  const formatXAxis = (tick) => {
    if (!tick) return 'No Data';
    try {
      const date = parseISO(tick);
      return viewType === 'hourly'
        ? format(date, 'ha').toLowerCase()
        : format(date, 'dd/MM');
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
        overflowX: viewType !== '7days' && isScrollEnabled ? 'scroll' : 'hidden',
      }}
    >
      <div style={{ width: containerWidth }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 22, left: 0, bottom: 20 }} 
          >
            <CartesianGrid stroke="white" strokeDasharray="5 5" />
            <XAxis
              dataKey={xAxisDataKey}
              stroke={graphColor}
              tick={{
                fontSize: isScrollEnabled && viewType !== '7days' ? 10 : 12,
              }}
              tickFormatter={formatXAxis}
              interval={0}
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
            <Bar dataKey={datakey} fill={graphColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
