'use client';

import { useEffect, useState } from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import LineChartComponent from '../../components/graphs/LineChartComponent';

export default function DustPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('weekly');

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
  const todayStr = today.toISOString().split('T')[0];

  // --- Latest average for today ---
  const todayData = data.filter(d => d.day === todayStr);
  const latestSummary = todayData.length > 0
    ? { dust: todayData.reduce((sum, d) => sum + d.dust, 0) / todayData.length }
    : data.reduce((prev, curr) => (curr.timestamp > prev.timestamp ? curr : prev), data[0]);

  // --- Weekly chart (last 7 days, averaged per day) ---
  const last7DaysRaw = data.filter(d => (today - d.timestamp) / (1000 * 60 * 60 * 24) <= 7);

  const weeklyAggregated = last7DaysRaw.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, sum: 0, count: 0 };
    acc[dayStr].sum += curr.dust;
    acc[dayStr].count++;
    return acc;
  }, {});

  const weeklyChartData = Object.values(weeklyAggregated)
    .map(d => ({ day: d.day, dust: d.sum / d.count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  // --- Monthly chart (current month only, averaged per day) ---
  const currentMonthData = data.filter(d => {
    const ts = d.timestamp;
    return ts.getUTCMonth() === today.getUTCMonth() && ts.getUTCFullYear() === today.getUTCFullYear();
  });

  const monthlyAggregated = currentMonthData.reduce((acc, curr) => {
    const dayStr = curr.timestamp.toISOString().split('T')[0];
    if (!acc[dayStr]) acc[dayStr] = { day: dayStr, sum: 0, count: 0 };
    acc[dayStr].sum += curr.dust;
    acc[dayStr].count++;
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyAggregated)
    .map(d => ({ day: d.day, dust: d.sum / d.count }))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  return (
<div className="app-container" style={{ minHeight: '100vh', flexDirection: 'column', display: 'flex' }}>
    <Header />
    <div style={{ flex: 1, padding: '2rem', fontFamily: 'Arial, sans-serif' }}>      <h1 style={{ 
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '600',
        letterSpacing: '1px',
         }}>Dust Data</h1>

      {/* Latest reading summary */}
      <div style={{
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '6px',
        maxWidth: '400px',
        backgroundColor: 'hsla(0,0%,100%,0.15)'
      }}>
        <p><strong>Latest Dust:</strong> {latestSummary.dust.toFixed(2)} µg/m³</p>
        {todayData.length > 0 && <p><strong>Time Recorded:</strong> Today&apos;s average</p>}
        {todayData.length === 0 && <p><strong>Time Recorded:</strong> {latestSummary.timestamp?.toLocaleString()}</p>}
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-6">
        <button className={`px-4 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 `} 
          onClick={() => setView('weekly')}>Weekly</button>
        <button className={`px-4 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700`} 
          onClick={() => setView('monthly')}>Monthly</button>
        </div>

      {/* Weekly chart */}
      {view === 'weekly' ? (
        <>
      <h2>Weekly Dust (Past 7 Days)</h2>
      <LineChartComponent
        data={weeklyChartData}
        datakey="dust"
        viewType="daily"
      />
      </>
      ) : ( 
      <>
  

      {/* Monthly chart */}
      <h2>Monthly Dust (This Month)</h2>
      <LineChartComponent
        data={monthlyChartData}
        datakey="dust"
        viewType="daily"
      />
      </>
      )}
      </div>
      <Footer />
      </div>
  );
}
