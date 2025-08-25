"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const sensors = [
    { name: "Temperature", icon: "🌡️" },
    { name: "Humidity", icon: "💧" },
    { name: "Wind", icon: "🌬️" },
    { name: "Rain", icon: "🌧️" },
    { name: "CO₂", icon: "🟢" },
    { name: "Dust", icon: "🌫️" },
    { name: "Air Pressure", icon: "📊" },
    { name: "Light Intensity", icon: "💡" },
  ];

  // --- Demo readings until real API works ---
  const [readings, setReadings] = useState({});

  useEffect(() => {
    const demo = {
      Temperature: "22°C",
      Humidity: "55%",
      Wind: "14 km/h",
      Rain: "2 mm",
      "CO₂": "420 ppm",
      "Air Pressure": "1012 hPa",
      Dust: "15 µg/m³",
      "Light Intensity": "750 lux",
    };
    setReadings(demo);
  }, []);

  return (
    <div className="min-h-screen bg-blue-200 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 bg-blue-300 rounded-b-3xl shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">🌦️ Our Weather Station</h1>
        <p className="max-w-2xl text-blue-900/90 leading-relaxed">
          A student-built IoT weather station using LoRaWAN to monitor temperature, humidity, wind, and more in real-time.
        </p>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div className="bg-blue-100 border border-blue-300 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-2xl font-bold mb-2 text-blue-900">About the Project</h2>
          <p>
            This weather station was developed to explore environmental monitoring, IoT, and communication protocols. 
            It collects data from multiple sensors and transmits it wirelessly to a server for analysis and visualization.
          </p>
          <p>
            The system provides real-time insights into local weather conditions including air quality and atmospheric changes. 
            It can be used for climate studies, agriculture, and educational purposes.
          </p>
          <ul className="list-disc list-inside ml-4 text-blue-900/90">
            <li>Temperature monitoring in °C</li>
            <li>Humidity levels in %</li>
            <li>Wind speed tracking in km/h</li>
            <li>Rainfall measurement in mm</li>
            <li>CO₂ and dust particle levels</li>
            <li>Air pressure trends</li>
            <li>Light intensity monitoring</li>
          </ul>
          <p>
            Future improvements may include predictive weather modeling, solar panel power integration, 
            and advanced data visualization dashboards.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-blue-100 border border-blue-300 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-2xl font-bold mb-2 text-blue-900">❓ FAQ</h2>
          {[
            { 
              q: "What sensors are used?", 
              a: (
                <ul className="list-disc list-inside space-y-1">
                  <li>XC3702 Barometric Pressure Sensor (Air Pressure)</li>
                  <li>XC3780 Dust Sensor (Air Quality & Particulates)</li>
                  <li>Duinotech Air Quality Sensor (CO₂ levels)</li>
                  <li>DHT22 Temperature & Humidity Sensor</li>
                  <li>Anemometer (Wind Speed)</li>
                  <li>Rain Gauge (Rainfall Measurement)</li>
                  <li>Photoresistor/Light Sensor (Light Intensity)</li>
                </ul>
              )
            },
            { q: "How often is data updated?", a: "Constantly in real time." },
            { q: "Where is the station located?", a: "On the roof of the Polytech’s D-Block." },
          ].map(({ q, a }) => (
            <details key={q} className="bg-blue-200 border border-blue-300 rounded-lg p-3">
              <summary className="cursor-pointer font-semibold text-blue-900">{q}</summary>
              <div className="mt-1 text-blue-900/80 text-sm">{a}</div>
            </details>
          ))}
        </div>

        {/* Key Sensors Section */}
        <div className="bg-blue-100 border border-blue-300 rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">🛠️ Key Sensors</h2>
          <div className="grid grid-cols-2 gap-4">
            {sensors.map((sensor) => (
              <div key={sensor.name} className="bg-blue-300 rounded-xl p-4 text-center shadow-sm">
                <span className="text-3xl">{sensor.icon}</span>
                <p className="mt-2 font-semibold text-blue-900">{sensor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Widgets Section */}
      <section className="bg-blue-300 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
    Current Readings <span className="text-lg font-normal text-blue-900/70">(Demo data, not real)</span>
    </h2>
    <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4">
    {Object.keys(readings).map((sensor) => (
      <div key={sensor} className="bg-blue-100 rounded-2xl p-6 text-center shadow-md">
        <p className="text-lg font-semibold text-blue-900">{sensor}</p>
        <p className="text-2xl mt-2 text-blue-900">{readings[sensor]}</p>
      </div>
    ))}
    </div>
  </section>
      <Footer />
    </div>
  );
}
