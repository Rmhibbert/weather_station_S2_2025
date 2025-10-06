'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';
import Footer from '../../components/footer';
import Header from '../../components/header';

export default function GasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/gas-data');
        const rawData = await response.json();

        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            gas_level: parseFloat(d.gas_level),
            day: ts.toISOString().split('T')[0],
            hour: ts.getUTCHours().toString().padStart(2, '0') + ':00',
          };
        });

        setData(parsed);
      } catch (err) {
        console.error('Error fetching gas data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading gas data...</p>;
  if (data.length === 0) return <p>No gas data available.</p>;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // --- Latest average for today ---
  const todayData = data.filter(d => d.day === todayStr);
  const latestSummary = todayData.length > 0
    ? { gas_level: todayData.reduce((sum, d) => sum + d.gas_level, 0) / todayData.length }
    : data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  // --- Weekly chart (last 7 days, averaged per day) ---
  const last7DaysRaw = data.filter(d => (today - d.timestamp) / (1000 * 60 * 60 * 24) <= 7);

  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, sum: 0, count: 0 };
    acc[dayStr].sum += curr.gas_level;
    acc[dayStr].count++;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated)
    .map(d => ({ day: d.day, gas_level: d.sum / d.count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  // --- Monthly chart (current month only, averaged per day) ---
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    return ts.getUTCMonth() === today.getUTCMonth() && ts.getUTCFullYear() === today.getUTCFullYear();
  });

  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, sum: 0, count: 0 };
    acc[dayStr].sum += curr.gas_level;
    acc[dayStr].count++;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyAggregated)
    .map(d => ({ day: d.day, gas_level: d.sum / d.count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Gas Level Data</h1>
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9'
      }}>
        <p><strong>Latest Gas Level:</strong> {latestSummary.gas_level.toFixed(2)} ppm</p>
        {todayData.length > 0
          ? <p><strong>Time Recorded:</strong> Today&apos;s average</p>
          : <p><strong>Time Recorded:</strong> {latestSummary.timestamp?.toLocaleString()}</p>
        }
      </div>

      {/* --- Weekly chart --- */}
      <h2>Daily Gas Level (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="gas_level"
        viewType="daily"
      />

      {/* --- Monthly chart --- */}
      <h2>Monthly Gas Level (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="gas_level"
        viewType="daily"
      />
      <Footer />
    </div>
  );
}
