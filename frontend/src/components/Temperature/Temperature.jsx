import React from 'react';
import '../WidgetBase.css';  
import './Temperature.css';  

const Temperature = ({ temperature }) => (
  <div className="widget temperature">
    <h2>Temperature</h2>
    <p>{temperature}</p>
  </div>
);

export default Temperature;