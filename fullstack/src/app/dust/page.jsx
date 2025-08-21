'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function DustPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dust-data');
        const rawData = await response.json();

        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            dust: parseFloat(d.dust),
            day: ts.toISOString().split('T')[0],
            hour: ts.getUTCHours().toString().padStart(2, '0') + ':00'
          };
        });

        setData(parsed);
      } catch (err) {
        console.error('Error fetching dust data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading dust data...</p>;
  if (data.length === 0) return <p>No dust data available.</p>;

  const today = new Date();

  const latest = data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  // Weekly chart
  const last7DaysRaw = data.filter(d => (today - d.timestamp) / (1000*60*60*24) <= 7);
  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, dust: 0 };
    acc[dayStr].dust += curr.dust;
    return acc;
  }, {});
  const weeklyChartData = Object.values(weeklyAggregated).sort((a,b)=>new Date(a.day)-new Date(b.day));

  // Monthly chart
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    return ts.getUTCMonth() === today.getUTCMonth() && ts.getUTCFullYear() === today.getUTCFullYear();
  });
  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, dust: 0 };
    acc[dayStr].dust += curr.dust;
    return acc;
  }, {});
  const monthlyChartData = Object.values(monthlyAggregated).sort((a,b)=>new Date(a.day)-new Date(b.day));

  return (
    <div style={{ background: 'white', color: 'black', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dust Data</h1>

      {/* Latest reading summary */}
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9'
      }}>
        <p><strong>Latest Dust:</strong> {latest.dust} µg/m³</p>
        <p><strong>Time Recorded:</strong> {latest.timestamp.toLocaleString()}</p>
      </div>

      {/* Weekly chart */}
      <h2>Daily Dust (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="dust"
        viewType="daily"
      />

      {/* Monthly chart */}
      <h2>Monthly Dust (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="dust"
        viewType="daily"
      />
    </div>
  );
}
