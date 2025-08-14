'use client';

import React, { useEffect, useState } from 'react';
import LineChartComponent from "@/components/graphs/LineChartComponent";

const StandaloneChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/get-graph-data?table=temperature&value=avg_temperature&length=7`);
      const json = await res.json();
      setData(json);
    };
    fetchGraphData();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#1a1a1a' }}>
      <h2 style={{ color: 'white' }}>Temperature (7 Days)</h2>
      <LineChartComponent
        data={data}
        datakey="avg_value" 
        viewType="day"      
      />
    </div>
  );
};

export default StandaloneChart;
