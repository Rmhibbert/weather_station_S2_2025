import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
import * as Tooltip from '@radix-ui/react-tooltip';
import './widget.css';

const tooltipMapping = {
  temperature:
    'Shows current ambient temperature in Celsius. Comfortable indoor range: 20-25°C; low or high values may affect comfort and efficiency.',
  pressure:
    'Displays air pressure in hectopascals. Standard at sea level is 1013 hPa; variations can indicate weather changes.',
  wind: 'Represents wind speed in kilometers per hour. High speeds can influence ventilation and comfort in open areas.',
  dust: 'Shows airborne dust concentration in micrograms per cubic meter. Lower levels indicate better air quality; values above 50 µg/m³ may affect health.',
  co2: 'Indicates CO₂ concentration in parts per million. Levels below 1000 ppm are optimal indoors; higher levels suggest poor ventilation.',
  gas: 'Reflects tvoc (Total volatile organic compounds) concentration in parts per million. Elevated readings could signal indoor air quality issues or pollutant sources. TVOC is a combination of all organic compounds present in the air, except carbon dioxide, carbon monoxide, and methane.',
  rain: 'Indicates the current rainfall level measured in millimeters per hour. Light rain is generally below 2.5 mm per hour',
  humidity:
    'Shows the relative humidity in percentage. Ideal indoor range is 30-50%; high levels can cause discomfort and mold growth.',
};

const Widget = ({ name, dataKey }) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipToggle = () => {
    setOpenTooltip((prev) => !prev);
  };

  return (
    <div
      // ------------------------------------------------------On click route to new page--------------------------------------------------------
      
      // TODO: Add routing to data pages when widget is clicked.

      className={`widget relative rounded-lg cursor-pointer`} // Add cursor pointer only if clickable
    >
      <div className="flex justify-between items-start p-4">
        <div >
          <p id="title">{name}</p>
          {/* <p>{value}</p> */}
          <p>Current Value</p>
        </div>

        <div className="absolute top-4 right-4">
          <Tooltip.Provider>
            <Tooltip.Root open={openTooltip} onOpenChange={setOpenTooltip}>
              <Tooltip.Trigger asChild>
                <span
                  className="inline-flex items-center justify-center w-6 h-6 text-white rounded-full text-lg cursor-pointer"
                  style={{ backgroundColor: '#113f67' }}
                  aria-label="Info"
                  onClick={handleTooltipToggle} // Add click functionality
                >
                  i
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content
                side="top"
                align="center"
                className="bg-gray-700 text-white text-xs p-2 rounded shadow-lg max-w-xs"
                onPointerDownOutside={() => setOpenTooltip(false)} // Close when clicking outside
              >
                {tooltipMapping[dataKey]}
                <Tooltip.Arrow className="fill-gray-700" />
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </div>
  );
};

export default Widget;
