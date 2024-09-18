import React, { useState } from 'react';

const Widget = ({ name, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`widget ${isExpanded ? 'expanded' : ''}`}>
      <h2>{name}</h2>
      <p>{data}</p>
      <button className="toggle-btn" onClick={toggleExpand}>
        {isExpanded ? 'Less' : 'More'}
      </button>
    </div>
  );
};

export default Widget;
