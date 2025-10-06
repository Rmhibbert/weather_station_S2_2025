'use client';

import { useEffect, useState } from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function WindPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('weekly');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/wind-data');
        const rawData = await response.json();

        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            wind_speed: parseFloat(d.wind_speed),
            day: ts.toISOString().split('T')[0],
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

  // --- Weekly aggregation ---
  const last7DaysRaw = data.filter(d => (today - d.timestamp) / (1000 * 60 * 60 * 24) <= 7);
  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, wind_speed: 0, count: 0 };
    acc[dayStr].wind_speed += curr.wind_speed;
    acc[dayStr].count += 1;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated)
    .map(d => ({ day: d.day, wind_speed: d.wind_speed / d.count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  // --- Monthly aggregation ---
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    return ts.getUTCMonth() === today.getUTCMonth() && ts.getUTCFullYear() === today.getUTCFullYear();
  });

  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, wind_speed: 0, count: 0 };
    acc[dayStr].wind_speed += curr.wind_speed;
    acc[dayStr].count += 1;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyAggregated)
    .map(d => ({ day: d.day, wind_speed: d.wind_speed / d.count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  // --- Latest summary (today's average if available, else latest reading) ---
  const todayStr = today.toISOString().split('T')[0];
  const todayData = data.filter(d => d.day === todayStr);

  const latestSummary = todayData.length > 0
    ? {
        wind_speed: todayData.reduce((sum, d) => sum + d.wind_speed, 0) / todayData.length,
        wind_direction: null, // no single direction for average
        timestamp: null
      }
    : data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  return (
<div className="app-container" style={{ minHeight: '100vh', flexDirection: 'column', display: 'flex' }}>
    <Header />
    <div style={{ flex: 1, padding: '2rem', fontFamily: 'Arial, sans-serif' }}>      <h1 style={{ 
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '600',
        letterSpacing: '1px',
         }}>Wind Data</h1>

      {/* --- Summary --- */}
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: 'hsla(0,0%,100%,0.15)'
      }}>
        <p><strong>Latest Wind Speed:</strong> {latestSummary.wind_speed.toFixed(2)} m/s</p>
        <p><strong>Wind Direction:</strong> {latestSummary.wind_direction ?? 'N/A'}</p>
        {todayData.length > 0
          ? <p><strong>Time Recorded:</strong> Today's average</p>
          : <p><strong>Time Recorded:</strong> {latestSummary.timestamp?.toLocaleString() ?? 'N/A'}</p>
        }
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-6">
        <button className={`px-4 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 `} 
          onClick={() => setView('weekly')}>Weekly</button>
        <button className={`px-4 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700`} 
          onClick={() => setView('monthly')}>Monthly</button>
        </div>

      {/* --- Weekly chart --- */}
      {view === 'weekly' ? (
        <>
      <h2>Daily Wind Speed (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="wind_speed"
        viewType="daily"
        />
        </>
        ) : ( 
        <>

      {/* --- Monthly chart --- */}
      <h2>Monthly Wind Speed (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="wind_speed"
        viewType="daily"
      />
      </>
      )}
      </div>
      <Footer />
      </div>
  );
}
