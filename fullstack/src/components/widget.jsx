import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';


// Sensor Mapping
const sensorMapping = {
  temperature: { unit: "°C", label: "Temperature" },
  pressure: { unit: "hPa", label: "Air Pressure" },
  humidity: { unit: "%", label: "Humidity" },
  windSpeed: { unit: "km/h", label: "Wind Speed" },
  dust: { unit: "µg/m³", label: "Dust Reading" },
  co2: { unit: "ppm", label: "CO2 Levels" },
  gas: { unit: "ppm", label: "Gas Levels" },
};

// Fetch data dynamically based on dataKey (temperature, pressure, etc.)
const fetchSensorData = async (dataKey) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/${dataKey}-data`);

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  return response.json();
};

const Widget = ({ name, dataKey, GraphComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch the data using React Query
  const { data, error, isLoading } = useQuery({
    queryKey: [dataKey],  
    queryFn: () => fetchSensorData(dataKey),  
  });
  

  const toggleExpand = () => {
    if (data) {
      setIsExpanded(!isExpanded);
    }
  };

  const latestData = data?.length ? data[data.length - 1] : null;  // Get the latest data point

  const renderLatestData = () => {
    if (isLoading) return "Loading...";
    if (error) return "Error fetching data";
    if (!latestData) return "No Data available";
  
    // Determine the correct value based on the dataKey
    let value;
    switch (dataKey) {
      case "temperature":
        value = latestData.avg_temperature;
        break;
      case "wind":
        // Ensure wind data is fetched correctly
        console.log('Wind data:', latestData);  // Log to verify wind data structure
        value = `${latestData.wind_speed} ${latestData.wind_direction}`;
        break;
      case "co2":
        value = latestData.co2_level;
        break;
      case "gas":
        value = latestData.gas_level;
        break;
      default:
        value = latestData[dataKey];  // Fallback in case of a direct match
    }
  
    return `${value}`;
  };
  
  
  

  return (
    <div className={`widget ${isExpanded ? "expanded" : ""} relative rounded-lg`}>
      <div className="flex justify-between items-start p-4">
        <p>{name}</p>
        <Button
          onClick={toggleExpand}
          disabled={!data}
          className={`${
            isExpanded
              ? "bg-[#34495e] border-2 border-white"
              : "bg-[hsla(0, 0%, 100%, .1)] hover:bg-[#2c3e50]"
          } text-white font-bold py-2 px-4 rounded-3xl`}
        >
          <span className={`${!data ? "text-gray-400" : ""}`}>
            {isExpanded ? "Less" : "More"}
          </span>
        </Button>
      </div>

      <p className="px-4 pb-2"> {renderLatestData()}</p>

      {isExpanded && GraphComponent && (
        <div className="graph-container px-4 pb-4">
          <GraphComponent data={data} datakey={dataKey} />
        </div>
      )}
    </div>
  );
};

export default Widget;
