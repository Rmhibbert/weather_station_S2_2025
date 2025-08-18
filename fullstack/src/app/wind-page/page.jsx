'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function WindPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/wind-data');
        const rawData = await response.json();

        // Parse data and add day/hour for charts
        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            wind_speed: parseFloat(d.wind_speed),
            day: ts.toISOString().split('T')[0], // YYYY-MM-DD UTC
            hour: ts.getUTCHours().toString().padStart(2, '0') + ':00',
            wind_direction: d.wind_direction
          };
        });

        setData(parsed);
      } catch (err) {
        console.error('Error fetching wind data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading wind data...</p>;
  if (data.length === 0) return <p>No wind data available.</p>;

  const today = new Date();

  // --- Latest reading ---
  const latest = data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  // --- Weekly chart (last 7 days, aggregated per day) ---
  const last7DaysRaw = data.filter(d => {
    const diffDays = (today.getTime() - d.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });

  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, wind_speed: 0, count: 0 };
    acc[dayStr].wind_speed += curr.wind_speed;
    acc[dayStr].count += 1;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated)
    .map(d => ({ day: d.day, wind_speed: d.wind_speed / d.count })) // average per day
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  // --- Monthly chart (current month only, aggregated per day) ---
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    const utcMonth = ts.getUTCMonth();
    const utcYear = ts.getUTCFullYear();
    return utcMonth === today.getUTCMonth() && utcYear === today.getUTCFullYear();
  });

  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, wind_speed: 0, count: 0 };
    acc[dayStr].wind_speed += curr.wind_speed;
    acc[dayStr].count += 1;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyAggregated)
    .map(d => ({ day: d.day, wind_speed: d.wind_speed / d.count })) // average per day
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  return (
    <div style={{ background: 'white', color: 'black', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Wind Data</h1>

      {/* --- Summary --- */}
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9'
      }}>
        <p><strong>Latest Wind Speed:</strong> {latest.wind_speed} m/s</p>
        <p><strong>Wind Direction:</strong> {latest.wind_direction}</p>
        <p><strong>Time Recorded:</strong> {latest.timestamp.toLocaleString()}</p>
      </div>

      {/* --- Weekly chart --- */}
      <h2>Daily Wind Speed (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="wind_speed"
        viewType="daily"
      />

      {/* --- Monthly chart --- */}
      <h2>Monthly Wind Speed (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="wind_speed"
        viewType="daily"
      />
    </div>
  );
}
