import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Widget = ({ name, data, GraphComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`widget ${isExpanded ? 'expanded' : ''} relative rounded-lg`}>
      <h2>{name}</h2>

      {/* Display a summary of the data, or just a placeholder like "Data available" */}
      <p>{Array.isArray(data) ? `Data available (${data.length} entries)` : data}</p>

      <Button
        onClick={toggleExpand}
        className="bg-[#34495e] hover:bg-[#2c3e50] text-white font-bold py-2 px-4 rounded-lg absolute top-2 right-2"
      >
        {isExpanded ? 'Less' : 'More'}
      </Button>

      {/* Render the graph component when expanded */}
      {isExpanded && GraphComponent && (
        <div className="graph-container">
          <GraphComponent data={data} />
        </div>
      )}
    </div>
  );
};

export default Widget;



