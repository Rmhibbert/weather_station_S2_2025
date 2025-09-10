'use client';

import { useEffect, useState } from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function TemperaturePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('weekly');


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/temperature-data');
        const rawData = await response.json();

        // Parse data and add day/hour for charts
        const parsed = rawData.map(d => {
          const ts = new Date(d.timestamp);
          return {
            ...d,
            timestamp: ts,
            temperature: parseFloat(d.temperature),
            day: ts.toISOString().split('T')[0], // YYYY-MM-DD UTC
            hour: ts.getUTCHours().toString().padStart(2, '0') + ':00',
          };
        });

        setData(parsed);
      } catch (err) {
        console.error('Error fetching temperature data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  if (loading) return <p>Loading temperature data...</p>;
  if (data.length === 0) return <p>No temperature data available.</p>;

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
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, temperature: 0, count: 0 };
    acc[dayStr].temperature += curr.temperature;
    acc[dayStr].count += 1;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated)
    .map(d => ({ day: d.day, temperature: d.temperature / d.count })) // average per day
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
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, temperature: 0, count: 0 };
    acc[dayStr].temperature += curr.temperature;
    acc[dayStr].count += 1;
    return acc;
  }, {})
  
  const monthlyChartData = Object.values(monthlyAggregated)
    .map(d => ({ day: d.day, temperature: d.temperature / d.count })) // average per day
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  return (
    <div className="app-container" style={{ minHeight: '100vh', flexDirection: 'column', display: 'flex' }}>
    <Header />
    <div style={{ flex: 1, padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Temperature Page</h1>
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        border: '1px solid #ccc',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: 'hsla(0,0%,100%,0.15)'
      }}>
        <p><strong>Latest temperature:</strong> {latest.temperature}&deg;C</p>
        <p><strong>Time Recorded:</strong> {latest.timestamp.toLocaleString()}</p>
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
      <h2>Daily temperature (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="temperature"
        viewType="daily"
      />
      </>
      ) : ( 
      <>

      {/* --- Monthly chart --- */}
      <h2>Monthly temperature (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="temperature"
        viewType="daily"
      />
      </>
      )}
    </div>
    <Footer />
    </div>
    
  );
}
