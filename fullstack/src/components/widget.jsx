import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Sensor Mapping
const sensorMapping = {
  temperature: { unit: "°C", label: "Temperature" },
  pressure: { unit: "hPa", label: "Air Pressure" },
  humidity: { unit: "%", label: "Humidity" },
  windSpeed: { unit: "km/h", label: "Wind Speed" },
};

const Widget = ({ data, GraphComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get the most recent data point 
  const latestData = Array.isArray(data) && data.length > 0 ? data[data.length - 1] : null;

  // Determine the type of sensor data we have and return the correct value and unit
  const renderLatestData = () => {
    if (!latestData) return "No Data available"; 

    // Check each key in the latest data to find the corresponding sensor value
    for (const key in latestData) {
      if (sensorMapping[key]) {
        const { unit } = sensorMapping[key];
        const value = latestData[key];
        return `${value} ${unit}`;
      }
    }

    return "Unknown sensor"; 
  };

  return (
    <div className={`widget ${isExpanded ? 'expanded' : ''} relative rounded-lg`}>

      {/* Display the most recent data or an error */}
      <p>{renderLatestData()}</p>

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

