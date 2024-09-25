import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Sensor Mapping
const sensorMapping = {
  temperature: { unit: "°C", label: "Temperature" },
  pressure: { unit: "hPa", label: "Air Pressure" },
  humidity: { unit: "%", label: "Humidity" },
  windSpeed: { unit: "km/h", label: "Wind Speed" },
};

const Widget = ({ name, data, GraphComponent, datakey }) => {
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
    <div className={`widget ${isExpanded ? "expanded" : ""} relative rounded-lg`}>
      <div className="flex justify-between items-start p-4">
        <p>{name}</p>
        <Button
          onClick={toggleExpand}
          className={`${
            isExpanded ? "bg-[#34495e] border-2 border-white" : "bg-[hsla(0, 0%, 100%, .1)]"
          } hover:bg-[#2c3e50] text-white font-bold py-2 px-4 rounded-3xl`}
        >
          {isExpanded ? "Less" : "More"}
        </Button>
      </div>

      <p className="px-4 pb-2"> {renderLatestData()}</p>

      {isExpanded && GraphComponent && (
        <div className="graph-container px-4 pb-4">
          <GraphComponent data={data} datakey={datakey} />
        </div>
      )}
    </div>
  );
};

export default Widget;
