import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data, datakey }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Transform the data for mobile view only, use full day names otherwise
  const transformedData = isMobile
    ? data.map(item => ({ ...item, day: item.day.charAt(0) })) // 'M', 'T', 'W', etc. for mobile
    : data; // Full day names for larger screens

  return (
    <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={transformedData} 
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#9ecfe3" strokeDasharray="5 5" /> 
          <XAxis 
            dataKey="day" 
            stroke="#113f67" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            stroke="#113f67" 
            allowDecimals={false} 
            padding={{ top: 10 }} 
            domain={[0, 35]} 
            ticks={[0, 5, 10, 15, 20, 25, 30, 35]} 
            tick={{ fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }} 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#113f67', borderRadius: '8px', padding: '5px' }} 
            itemStyle={{ color: '#113f67' }} 
            labelFormatter={() => ''} 
          />
          <Line 
            type="monotone" 
            dataKey={datakey} 
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











