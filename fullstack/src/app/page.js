'use client';
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
        <Widget name="Gas" dataKey="gas" GraphComponent={LineChartComponent} />
        <Widget
          name="Dust"
          dataKey="dust"
          GraphComponent={LineChartComponent}
        />
      </div>
      <Footer />
    </div>
  );
}
