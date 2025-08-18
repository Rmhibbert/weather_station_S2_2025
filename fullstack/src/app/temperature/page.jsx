'use client';

import React, { useEffect, useState } from 'react';
import LineChartComponent from "@/components/graphs/LineChartComponent";

export default function TemperaturePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/temperature-data')
      .then((res) => res.json())
      .then((data) => {
        console.log("Temperature API response:", data);
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading temperature data...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Temperature Page</h1>
      {data.length === 0 ? (
        <p>No temperature data available.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.map((item) => (
            <li
              key={item.timestamp}
              style={{
                padding: '0.8rem',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '6px',
                maxWidth: '400px',
              }}
            >
              <p><strong>Temperature :</strong> {item.avg_temperature} +C</p>
              <p><strong>Time recorded:</strong> 
              {new Date(item.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
