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

const BarChartComponent = ({ data, datakey, viewType }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get Y-axis configuration
  const { domain, ticks } = calculateYAxisConfig(data, datakey);

  // Determine the x-axis data key based on viewType (hourly, 7 days, or 30 days)
  const xAxisDataKey = viewType === 'hourly' ? 'hour' : 'day';

  // Transform the data for mobile view only, use full day names otherwise
  const transformedData = isMobile
    ? data.map((item) => ({ ...item, [xAxisDataKey]: item[xAxisDataKey]?.charAt(0) })) // 'M', 'T', 'W', etc. for mobile
    : data; // Full day names for larger screens

  return (
    <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 22, left: 0, bottom: 5 }}
        >
          <CartesianGrid stroke="white" strokeDasharray="5 5" />
          <XAxis
            dataKey={xAxisDataKey}
            stroke="#113f67"
            tick={{ fontSize: isMobile ? 8 : 12 }}
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
          <Bar dataKey={datakey} fill="#113f67" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
