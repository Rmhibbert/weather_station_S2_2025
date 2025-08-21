'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function RainPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/rain-data');
        const rawData = await response.json();

        // Parse data and add day/hour for charts
        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            rainfall_mm: parseFloat(d.rainfall_mm),
            day: ts.toISOString().split('T')[0], // YYYY-MM-DD UTC
            hour: ts.getUTCHours().toString().padStart(2, '0') + ':00'
          };
        });

        setData(parsed);
      } catch (err) {
        console.error('Error fetching rainfall data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading rainfall data...</p>;

  if (data.length === 0) return <p>No rainfall data available.</p>;

  const today = new Date();

  // --- Latest reading ---
  const latest = data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  // --- Weekly chart (last 7 days, aggregated per day) ---
  const last7DaysRaw = data.filter(d => {
    const diffDays = (today.getTime() - d.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });

  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD UTC
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, rainfall_mm: 0 };
    acc[dayStr].rainfall_mm += curr.rainfall_mm;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated).sort(
    (a, b) => new Date(a.day) - new Date(b.day)
  );

  // --- Monthly chart (current month only, aggregated per day) ---
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    const utcMonth = ts.getUTCMonth();
    const utcYear = ts.getUTCFullYear();
    return utcMonth === today.getUTCMonth() && utcYear === today.getUTCFullYear();
  });

  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD UTC
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, rainfall_mm: 0 };
    acc[dayStr].rainfall_mm += curr.rainfall_mm;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyAggregated).sort(
    (a, b) => new Date(a.day) - new Date(b.day)
  );

  return (
    <div style={{ background: 'white', color: 'black', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Rainfall Data</h1>

      {/* --- Summary --- */}
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9'
      }}>
        <p>
          <strong>Latest Rainfall:</strong> {latest.rainfall_mm} mm
        </p>
        <p>
          <strong>Time Recorded:</strong> {latest.timestamp.toLocaleString()}
        </p>
      </div>

      {/* --- Weekly chart --- */}
      <h2>Daily Rainfall (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="rainfall_mm"
        viewType="daily"
      />

      {/* --- Monthly chart --- */}
      <h2>Monthly Rainfall (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="rainfall_mm"
        viewType="daily"
      />
    </div>
  );
}
