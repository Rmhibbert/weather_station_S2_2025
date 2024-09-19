import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Sensor Mapping
const sensorMapping = {
  temperature: { unit: "°C", label: "Temperature" },
  pressure: { unit: "hPa", label: "Air Pressure" },
  humidity: { unit: "%", label: "Humidity" },
  windSpeed: { unit: "km/h", label: "Wind Speed" },
};

const Widget = ({ name, data, GraphComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const latestData =
    Array.isArray(data) && data.length > 0 ? data[data.length - 1] : null;

  const renderLatestData = () => {
    if (!latestData) return "No Data available";

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
    <div
      className={`widget ${isExpanded ? "expanded" : ""} relative rounded-lg`}
    >
      <p>{name}:</p>
      <p> {renderLatestData()}</p>

      <Button
        onClick={toggleExpand}
        className="bg-[#34495e] hover:bg-[#2c3e50] text-white font-bold py-4 px-6 rounded-lg absolute top-4 right-4"
      >
        {isExpanded ? "Less" : "More"}
      </Button>

      {isExpanded && GraphComponent && (
        <div className="graph-container">
          <GraphComponent data={data} />
        </div>
      )}
    </div>
  );
};

export default Widget;

