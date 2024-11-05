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

const LineChartComponent = ({ data, datakey, viewType }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { domain, ticks } = calculateYAxisConfig(data, datakey);

  const xAxisDataKey = viewType === 'hourly' ? 'hour' : 'day';

  console.log('Original data:', data);

  const dateKey = viewType === 'hourly' ? 'hour' : 'day';

  const validData = data.filter(
    (item) => item[dateKey] !== undefined && item[dateKey] !== null,
  );

  console.log('Valid data points:', validData);

  const sortedData = validData.slice().sort((a, b) => {
    const dateA = parseISO(a[dateKey]);
    const dateB = parseISO(b[dateKey]);

    if (isNaN(dateA) || isNaN(dateB)) {
      console.warn('Invalid date encountered:', a[dateKey], b[dateKey]);
      return 0;
    }

    return dateA - dateB;
  });

  console.log('Sorted data:', sortedData);

  const filteredData = sortedData.slice(viewType === 'hourly' ? -24 : -30); // Adjust slice for the view type

  console.log('Filtered data:', filteredData);

  const formatXAxis = (tick) => {
    if (!tick) return 'No Data';
    try {
      const date = parseISO(tick);
      // Format as '5pm', '6pm', etc. without spacing
      return viewType === 'hourly'
        ? format(date, 'ha').toLowerCase()
        : format(date, 'dd/MM');
    } catch (error) {
      console.error('Error formatting date:', error, 'Original tick:', tick);
      return 'Invalid Date';
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={filteredData}
          margin={{ top: 10, right: 22, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="white" strokeDasharray="5 5" />
          <XAxis
            dataKey={xAxisDataKey}
            stroke="#113f67"
            tick={{ fontSize: 12 }}
            tickFormatter={formatXAxis}
            interval={0}
          />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            stroke="#113f67"
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#113f67',
              borderRadius: '8px',
              padding: '5px',
            }}
            itemStyle={{ color: '#113f67' }}
            labelFormatter={() => ''}
          />
          <Line
            type="monotone"
            dataKey="avg_value"
            stroke="#113f67"
            strokeWidth={2}
            dot={{ fill: '#113f67', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
