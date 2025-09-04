"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col bg-gradient-to-b from-[#1e3c72] to-[#6699cc]">
      <Header />

      {/* About Section (Landscape style, centered) */}
      <section className="flex-grow flex justify-center items-center py-16 px-6">
        <div className="bg-white text-blue-900 border border-blue-300 rounded-2xl p-10 shadow-md max-w-5xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">About the Project</h2>

          <p className="mb-4 text-lg leading-relaxed">
            This weather station was developed to explore environmental monitoring, IoT, and communication protocols.
            It collects data from multiple sensors and transmits it wirelessly to a server for analysis and visualization.
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            The system provides real-time insights into local weather conditions including air quality and atmospheric changes.
            It can be used for climate studies, agriculture, and educational purposes.
          </p>

          <ul className="list-disc list-inside ml-6 text-lg space-y-1">
            <li>Temperature monitoring in °C</li>
            <li>Humidity levels in %</li>
            <li>Wind speed tracking in km/h</li>
            <li>Rainfall measurement in mm</li>
            <li>CO₂ and dust particle levels</li>
            <li>Air pressure trends</li>
            <li>Light intensity monitoring</li>
          </ul>

          <p className="mt-6 text-lg leading-relaxed">
            Future improvements may include predictive weather modeling, solar panel power integration,
            and advanced data visualization dashboards.
          </p>

          {/* Former FAQ info merged here */}
          <div className="mt-10 space-y-4 text-lg leading-relaxed">
            <h3 className="text-2xl font-semibold">Additional Details</h3>

            <p>
              <strong>What sensors are used?</strong> The system includes:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>XC3702 Barometric Pressure Sensor (Air Pressure)</li>
              <li>XC3780 Dust Sensor (Air Quality & Particulates)</li>
              <li>Duinotech Air Quality Sensor (CO₂ levels)</li>
            </ul>

            <p>
              <strong>How often is data updated?</strong> Constantly in real time.
            </p>

            <p>
              <strong>Where is the station located?</strong> On the roof of the Polytech’s D-Block.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with accessible white text */}
      <footer className="text-white">
        <Footer />
      </footer>
    </div>
  );
}
