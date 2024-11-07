'use client';

import Link from 'next/link'; // Import the Link component for internal navigation

import Widget from '@/components/widget';
import LineChartComponent from '@/components/graphs/LineChartComponent';
import BarChartComponent from '@/components/graphs/BarChartComponent';
import Header from '../components/header';
import Footer from '../components/footer';
import './page.css';

export default function Home() {
  return (
    <div className="app-container">
      <Header />

      {/* Widgets Section */}
      <div className="widgets">
        <Widget
          name="Temperature"
          dataKey="temperature"
          GraphComponent={null}
        />
        <Widget name="Air Pressure" dataKey="pressure" GraphComponent={null} />
        <Widget name="Wind" dataKey="wind" GraphComponent={null} />
        <Widget name="CO2" dataKey="co2" GraphComponent={null} />
        <Widget name="Gas" dataKey="gas" GraphComponent={null} />
        <Widget name="Dust" dataKey="dust" GraphComponent={null} />

        {/* Link to the internal cloud-details page */}
        <Link href="/cloud-details" passHref>
          <Widget name="Cloud" GraphComponent={null} />
        </Link>
      </div>

      <Footer />
    </div>
  );
}
