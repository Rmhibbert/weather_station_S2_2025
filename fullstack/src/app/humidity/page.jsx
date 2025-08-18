'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function HumidityPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/humidity-data')
      .then((res) => res.json())
      .then((data) => {
        // setData(data);
        const sorted = data.sort( 
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setData(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading humidity data...</p>;

  if (data.length === 0) return <p>No humidity data available.</p>;
  const latest = data[data.length - 1];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const last7DaysData = data.filter(
    (item) => new Date(item.timestamp) >= sevenDaysAgo
  );

  const chartData = last7DaysData.map((item) => {
    const date = new Date(item.timestamp);
    return {
      day: `${date.getDate()}/${date.getMonth() + 1}`,   // for daily
      hourly: `${date.getHours()}:${String(date.getMinutes()).padStart(2,'0')}`, // for hourly
      humidity: Number(item.humidity),  // ensure numeric
    };
  });
  
  

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Humidity Page</h1>
      {/* {data.length === 0 ? (
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
      )} */}

      <div
        style={{
          padding: '1rem',
          marginBottom: '2rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          maxWidth: '400px',
        }}
      >
        <p>
          <strong>Latest Rain Amount:</strong> {latest.humidity} mm
        </p>
        <p>
          <strong>Time Recorded:</strong>{' '}
          {new Date(latest.timestamp).toLocaleString()}
        </p>
      </div>

      <div style={{ maxWidth: '800px', height: '350px' }}>
      <LineChartComponent
        data={chartData}
        datakey="humidity"   // matches chartData field
        viewType="daily"     // or "hourly" for hourly view
      />
      </div>
      console.log(chartData);
    </div>
  );
}
