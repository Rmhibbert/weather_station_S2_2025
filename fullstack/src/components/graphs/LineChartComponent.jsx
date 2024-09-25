import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data, datakey }) => {
  return (
    <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#9ecfe3" strokeDasharray="5 5" /> 
          <XAxis dataKey="day" stroke="#113f67" />
          <YAxis stroke="#113f67" allowDecimals={false} padding={{ top: 10 }} />
          <Tooltip 
            cursor={{ fill: 'transparent' }} 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#113f67', borderRadius: '8px', padding: '5px' }} 
            itemStyle={{ color: '#113f67' }} 
            labelFormatter={() => ''}
          />
          <Line type="monotone" dataKey={datakey} stroke="#113f67" strokeWidth={2} dot={{ fill: '#113f67', r: 5 }} /> 
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;

