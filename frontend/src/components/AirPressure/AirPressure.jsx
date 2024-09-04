import React from 'react';
import '../WidgetBase.css';  
import './AirPressure.css';  

const AirPressure = ({ airPressure }) => (
  <div className="widget air-pressure">
    <h2>Air Pressure</h2>
    <p>{airPressure}</p>
  </div>
);

export default AirPressure;