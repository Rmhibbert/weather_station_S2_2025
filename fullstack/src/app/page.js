'use client';
import Widget from "@/components/widget";
import LineChartComponent from "@/components/graphs/LineChartComponent";
import BarChartComponent from "@/components/graphs/BarChartComponent";
import Link from 'next/link';  // Import the Link component for internal routing
import "./page.css";

export default function Home() {
  return (
    <div className="app-container">
      <div className="widgets">
        <Widget name="Temperature" dataKey="temperature" GraphComponent={null} />
        <Widget name="Air Pressure" dataKey="pressure" GraphComponent={null} />
        <Widget name="Wind" dataKey="wind" GraphComponent={null} />
        <Widget name="CO2" dataKey="co2" GraphComponent={null} />
        <Widget name="Gas" dataKey="gas" GraphComponent={null} />
        <Widget name="Dust" dataKey="dust" GraphComponent={null} />

        {/* Link to external site */}
        <a href="https://huggingface.co/spaces/TomMc9010/Cloud_AI_model" target="_blank" rel="noopener noreferrer">
          <Widget name="Cloud" GraphComponent={null} />
        </a>
      </div>
    </div>
  );
}
