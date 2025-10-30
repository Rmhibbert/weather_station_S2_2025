'use client';

import { useEffect, useState } from 'react';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function Co2Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/co2-data');
        const rawData = await response.json();

        // Parse data and add day/hour for charts
        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            co2_level: parseFloat(d.co2_level),
            day: ts.toISOString().split('T')[0], // YYYY-MM-DD UTC
            hour: ts.getUTCHours().toString().padStart(2, '0') + ':00',
          };
        });

        setData(parsed);
      } catch (err) {
        console.error('Error fetching co2 data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  if (loading) return <p>Loading co2 data...</p>;
  if (data.length === 0) return <p>No co2 data available.</p>;

  const today = new Date();

  // Latest reading
  const latest = data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  // Weekly chart (last 7 days, aggregated per day)
  const last7DaysRaw = data.filter(d => {
    const diffDays = (today.getTime() - d.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });

  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, co2_level: 0, count: 0 };
    acc[dayStr].co2_level += curr.co2_level;
    acc[dayStr].count += 1;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated)
    .map(d => ({ day: d.day, co2_level: d.co2_level / d.count })) // average per day
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  //Monthly chart (current month only, aggregated per day)
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    const utcMonth = ts.getUTCMonth();
    const utcYear = ts.getUTCFullYear();
    return utcMonth === today.getUTCMonth() && utcYear === today.getUTCFullYear();
  });

  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, co2_level: 0, count: 0 };
    acc[dayStr].co2_level += curr.co2_level;
    acc[dayStr].count += 1;
    return acc;
  }, {})
  
  const monthlyChartData = Object.values(monthlyAggregated)
    .map(d => ({ day: d.day, co2_level: d.co2_level / d.count })) // average per day
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>CO2 Page</h1>
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9'
      }}>
        <p><strong>Latest co2_level:</strong> {latest.co2_level}%</p>
        <p><strong>Time Recorded:</strong> {latest.timestamp.toLocaleString()}</p>
      </div>

      {/*Weekly chart*/}
      <h2>Daily co2_level (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="co2_level"
        viewType="daily"
      />

      {/*Monthly chart*/}
      <h2>Monthly co2_level Speed (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="co2_level"
        viewType="daily"
      />
    </div>
  );
}
 