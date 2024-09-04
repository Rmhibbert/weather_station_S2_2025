import React from 'react';
import '../WidgetBase.css';  
import './Wind.css';  

const Wind= ({ wind }) => (
  <div className="widget wind">
    <h2>Wind</h2>
    <p>{wind}</p>
  </div>
);

export default Wind;