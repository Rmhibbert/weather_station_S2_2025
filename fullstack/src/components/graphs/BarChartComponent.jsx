import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data }) => {
  return (
    <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
      <ResponsiveContainer>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#113f67" />
          <YAxis stroke="#113f67" allowDecimals={false} padding={{ top: 10 }} /> 
          <Tooltip 
            cursor={{ fill: 'transparent' }} 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#113f67', borderRadius: '8px', padding: '5px' }} 
            itemStyle={{ color: '#113f67' }} 
            labelFormatter={() => ''} 
          />
          <Legend />
          <Bar dataKey="pressure" fill="#113f67" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;




