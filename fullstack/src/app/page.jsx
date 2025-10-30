'use client';

import Widget from '@/components/widget';
import Header from '../components/header';
import Footer from '../components/footer';
import './page.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <Header />
        {/* Widgets Section */}
        <div className="widgets">
          <Widget name="Temperature" dataKey="temperature" />
          <Widget name="Rain" dataKey="rain" />
          <Widget name="Air Pressure" dataKey="pressure" />
          <Widget name="Wind" dataKey="wind" />
          {/* <Widget name="CO2" dataKey="co2" />
          <Widget name="Gas" dataKey="gas" /> */}
          <Widget name="Dust" dataKey="dust" />
          <Widget name="Humidity" dataKey="humidity" />
        </div>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}