'use client';
import Webcam from "@/components/Webcam/Webcam";
import Widget from "@/components/widget";
import LineChartComponent from "@/components/graphs/LineChartComponent";
import BarChartComponent from "@/components/graphs/BarChartComponent";
import "./page.css";

// Dummy data for the graphs
const temperatureData = [
  { day: 'Monday', temperature: 20 },
  { day: 'Tuesday', temperature: 22 },
  { day: 'Wednesday', temperature: 19 },
  { day: 'Thursday', temperature: 24 },
  { day: 'Friday', temperature: 25 },
  { day: 'Saturday', temperature: 23 },
  { day: 'Sunday', temperature: 21 },
];

const airPressureData = [
  { day: 'Monday', pressure: 1000 },
  { day: 'Tuesday', pressure: 1005 },
  { day: 'Wednesday', pressure: 1010 },
  { day: 'Thursday', pressure: 1008 },
  { day: 'Friday', pressure: 1007 },
  { day: 'Saturday', pressure: 2000 },
  { day: 'Sunday', pressure: 1002 },
];

export default function Home() {
  return (
    <div className="app-container">
      <div className="widgets">
        <Widget name={'Temperature'} data={temperatureData} GraphComponent={LineChartComponent} datakey="temperature"/>
        <Widget name={'Air Pressure'} data={airPressureData} GraphComponent={BarChartComponent} datakey="pressure"/>
        <Widget name={'Humidity'} data={'coming soon'} GraphComponent={null} />
        <Widget name={'Wind'} data={'coming soon'} GraphComponent={null} />
        <Webcam />
        <Widget name={'Dust'} data={'coming soon'} GraphComponent={null} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
      const temperatureResponse = await fetch('http://localhost:3000/api/recieve-data/temperature');
      const humidityResponse = await fetch('http://localhost:3000/api/recieve-data/humidity');
      const pressureResponse = await fetch('http://localhost:3000/api/recieve-data/pressure');

      if (!temperatureResponse.ok || !humidityResponse.ok || !pressureResponse.ok) {
          throw new Error('Failed to fetch data');
      }

      const temperatureData = await temperatureResponse.json();
      const humidityData = await humidityResponse.json();
      const pressureData = await pressureResponse.json();

      return {
          props: {
              temperatureData,
              humidityData,
              pressureData,
          },
      };
  } catch (error) {
      console.error(error);
      return {
          props: {
              error: error.message,
          },
      };
  }
}
