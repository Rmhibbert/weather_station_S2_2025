import React from 'react';
import BarChart from '../BarChart/BarChart'; 

const Temperature = ({ temperature }) => {
  const dummyTemperatureData = [15, 20, 25, 30, 35];  

  return (
    <div className="widget temperature-widget">
      <h3>Temperature: {temperature}</h3>
      <BarChart data={dummyTemperatureData} width={300} height={200} xLabel="Day" yLabel="Temp (°C)" />
    </div>
  );
}

export default Temperature;
