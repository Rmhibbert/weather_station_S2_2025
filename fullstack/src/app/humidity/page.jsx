'use client';

import { useEffect, useState } from 'react';

export default function HumidityPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/humidity-data')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading humidity data...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Rain Page</h1>
      {data.length === 0 ? (
        <p>No humidity data available.</p>
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
              <p><strong>Humidity:</strong> {item.humidity} %</p>
              <p><strong>Time recorded:</strong> {new Date(item.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
