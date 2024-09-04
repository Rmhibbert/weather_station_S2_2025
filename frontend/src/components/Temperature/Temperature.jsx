import React from 'react';
import BarChart from '../BarChart/BarChart'; 

const Temperature = ({ temperature }) => {
    const variedData = [10, 30, 50, 20, 80, 40, 60];

  return (
    <div className="widget temperature-widget">
      <h3>Temperature: {temperature}</h3>
        <p>{temperature}</p>
    </ div>
  )
}
export default Temperature;
