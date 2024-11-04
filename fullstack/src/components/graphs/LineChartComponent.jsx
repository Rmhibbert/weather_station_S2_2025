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

const LineChartComponent = ({ data, datakey, viewType }) => {
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
  console.log('Y-axis config in LineChartComponent:', { domain, ticks });

  // Determine the x-axis data key based on viewType (hourly, 7 days, or 30 days)
  const xAxisDataKey = viewType === 'hourly' ? 'hour' : 'day';

  return (
    <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 22, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#9ecfe3" strokeDasharray="5 5" />
          <XAxis dataKey={xAxisDataKey} stroke="#113f67" tick={{ fontSize: 12 }} />
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
