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

  const validData = data.filter(
    (item) => item[xAxisDataKey] !== undefined && item[xAxisDataKey] !== null,
  );

  const sortedData = validData.slice().sort((a, b) => {
    const dateA = parseISO(a[xAxisDataKey]);
    const dateB = parseISO(b[xAxisDataKey]);
    return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
  });

  const filteredData = sortedData.slice(viewType === 'hourly' ? -24 : -30);

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
    <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 22, left: 0, bottom: 5 }}
        >
          <CartesianGrid stroke="white" strokeDasharray="5 5" />
          <XAxis
            dataKey={xAxisDataKey}
            stroke="#113f67"
            tick={{ fontSize: isMobile ? 8 : 12 }}
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
          <Bar dataKey={datakey} fill="#113f67" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
