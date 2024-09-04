import React from 'react';
import '../WidgetBase.css';  
import './Humidity.css';  

const Humidity = ({ humidity }) => (
  <div className="widget temperature">
    <h2>Humidity</h2>
    <p>{humidity}</p>
  </div>
);

export default Humidity;