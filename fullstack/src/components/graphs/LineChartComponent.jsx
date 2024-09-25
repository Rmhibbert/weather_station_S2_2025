import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Function to calculate Y-axis domain and ticks
const calculateYAxisConfig = (data, datakey) => {
  const maxValue = Math.max(...data.map(item => item[datakey]));
  
  const minValue = 0; // Force the minimum value to be 0
  const range = maxValue - minValue;
  
  // Determine a sensible tick interval based on the range
  const tickInterval = Math.ceil(range / 10); // Divides range into equal intervals

  const adjustedMaxValue = Math.ceil(maxValue / tickInterval) * tickInterval;

  const ticks = [];
  for (let i = minValue; i <= adjustedMaxValue; i += tickInterval) {
    ticks.push(i);
  }

  return { domain: [minValue, adjustedMaxValue], ticks };
};


const LineChartComponent = ({ data, datakey }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use the calculateYAxisConfig function to get the Y-axis config
  const { domain, ticks } = calculateYAxisConfig(data, datakey);

  // Transform the data for mobile view only, use full day names otherwise
  const transformedData = isMobile
    ? data.map(item => ({ ...item, day: item.day.charAt(0) })) // 'M', 'T', 'W', etc. for mobile
    : data; // Full day names for larger screens

  return (
    <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={transformedData} 
          margin={{ top: 10, right: 22, left: 0, bottom: 0 }}
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
            domain={domain} // Dynamic domain from function
            ticks={ticks}   // Dynamic ticks from function
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













