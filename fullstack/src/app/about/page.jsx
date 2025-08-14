"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Placeholder components
const SearchHeader = () => <div className="text-white p-4">Search Header Placeholder</div>;
const SunriseSunset = () => <div className="text-white p-4">Sunrise/Sunset Placeholder</div>;
const LocationDetails = () => <div className="text-white p-4">Location Details Placeholder</div>;

export default function AboutPage() {
  const crewImages = ["crew1.jpg", "crew2.jpg", "crew3.jpg", "crew4.jpg"];

  return (
    <div className="min-h-screen bg-blue-600 text-white relative font-sans">
      <div className="absolute inset-0 bg-blue-500/30 backdrop-blur-lg z-0" />
      <div className="relative z-10 w-full min-h-screen max-w-[2800px] mx-auto overflow-auto flex flex-col lg:pr-10">
        {/* Header */}
        <div className="pt-4">
          <Header />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col flex-1 ml-0 lg:ml-28 px-4 pt-3 sm:px-6 pb-6 space-y-6">
          <SearchHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Section */}
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg text-white leading-relaxed text-justify space-y-4">
              <h1 className="text-2xl font-bold mb-2">
                🌦️ About Our Weather Station
              </h1>
              <p>
                This project was a student-built weather station designed to meet
                the requirements outlined by our lecturer...
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Temperature</li>
                <li>Humidity</li>
                <li>Wind speed</li>
                <li>And more...</li>
              </ul>
              <p>Using LoRaWAN, this data is sent wirelessly...</p>
            </div>

            {/* FAQ */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl text-white/90 space-y-4">
              <h2 className="text-xl font-bold mb-2">❓ FAQ</h2>
              {[
                { q: "What sensors are used?", a: "XC3702 Barometric, XC3780 Dust Sensor..." },
                { q: "How often is data updated?", a: "The data is updated constantly..." },
                { q: "Device location?", a: "On the roof of the Polytech’s D-Block." },
              ].map(({ q, a }) => (
                <details key={q} className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4">
                  <summary className="cursor-pointer font-semibold text-white">{q}</summary>
                  <p className="mt-2 text-sm text-white/80">{a}</p>
                </details>
              ))}
            </div>

            {/* Crew Highlights */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg space-y-4">
              <h2 className="text-xl font-bold text-white text-center mb-2">📸 Highlights</h2>
              <div className="grid grid-cols-2 gap-3">
                {crewImages.map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-white/20 group aspect-[4/3]">
                    <div className="relative w-full h-0 pb-[75%]">
                      <Image
                        src={`/images/Crew/${img}`}
                        alt={`Crew member ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out rounded-xl"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location and Sunrise/Sunset */}
          <div className="text-white w-full max-w-6xl mx-auto space-y-4 mt-6">
            <LocationDetails />
            <SunriseSunset />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
