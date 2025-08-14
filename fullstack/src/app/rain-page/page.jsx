'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';


export default function RainPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/rain-data')
      .then((res) => res.json())
      .then((data) => {
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

  if (loading) return <p>Loading rain data...</p>;



  if (data.length === 0) return <p>No rain data available.</p>;

  // Latest reading
  const latest = data[data.length - 1];

  // Filter for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const last7DaysData = data.filter(
    (item) => new Date(item.timestamp) >= sevenDaysAgo
  );

  const chartData = last7DaysData.map((item) => ({
    day: new Date(item.timestamp).toISOString(),
    hourly: new Date(item.timestamp).toISOString(),
    rainfall_mm: item.rainfall_mm,
  }));


  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Rain Page</h1>

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
          <strong>Latest Rain Amount:</strong> {latest.rainfall_mm} mm
        </p>
        <p>
          <strong>Time Recorded:</strong>{' '}
          {new Date(latest.timestamp).toLocaleString()}
        </p>
      </div>

      <div style={{ maxWidth: '800px', height: '350px' }}>
        <LineChartComponent
          data={chartData}
          datakey="rainfall_mm"
          viewType="daily"
        />
      </div>
    </div>
  );
}