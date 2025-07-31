'use client';

import Link from 'next/link'; // Import the Link component for internal navigation
import Cloud from '@/components/cloud';
import { useEffect, useState } from 'react';
import Widget from '@/components/widget';
import LineChartComponent from '@/components/graphs/LineChartComponent';
import BarChartComponent from '@/components/graphs/BarChartComponent';
import Header from '../components/header';
import Footer from '../components/footer';
import './page.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient();

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/co2-data')
      .then(res => res.json())
      .then(json => setData(json[0]))
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <Header />

        {/* Widgets Section */}
        <div className="widgets">
          <Widget
            name="Temperature"
            dataKey="temperature"
            GraphComponent={LineChartComponent}
          />
          <Widget
            name="Rain"
            dataKey="rain"
            GraphComponent={LineChartComponent}
          />
          <Widget
            name="Air Pressure"
            dataKey="pressure"
            GraphComponent={LineChartComponent}
          />
          <Widget
            name="Wind"
            dataKey="wind"
            GraphComponent={LineChartComponent}
          />
          <Widget name="CO2" dataKey="co2" GraphComponent={BarChartComponent} />
          <Widget name="Gas" dataKey="gas" GraphComponent={BarChartComponent} />
          <Widget
            name="Dust"
            dataKey="dust"
            GraphComponent={LineChartComponent}
          />
          <Widget
            name="Humidity"
            dataKey="humidity"
            GraphComponent={LineChartComponent}
          />
          <h1>{data.co2_level}</h1>
      <Cloud />
          {/* name="Cloud Prediction Model"
          dataKey="cloud"
          GraphComponent={LineChartComponent}
        /> */}
        </div>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
