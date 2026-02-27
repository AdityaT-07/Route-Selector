import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Home = () => {
  const [initialAddress, setInitialAddress] = useState("");
  const [finalAddress, setFinalAddress] = useState("");
  const [optimizationType, setOptimizationType] = useState("time");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      initialAddress,
      finalAddress,
      optimizationType,
      weight,
      volume,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PANEL - FORM */}
        <div className="lg:col-span-1 bg-gray-900 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Shipment Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Initial Address */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Initial Address
              </label>
              <input
                type="text"
                value={initialAddress}
                onChange={(e) => setInitialAddress(e.target.value)}
                placeholder="Enter starting location"
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {/* Final Address */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Final Address
              </label>
              <input
                type="text"
                value={finalAddress}
                onChange={(e) => setFinalAddress(e.target.value)}
                placeholder="Enter destination"
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            {/* Optimization */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Preferred Optimization
              </label>
              <select
                value={optimizationType}
                onChange={(e) => setOptimizationType(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              >
                <option value="time">Time</option>
                <option value="cost">Cost</option>
                <option value="emissions">Emissions</option>
              </select>
            </div>

            {/* Shipment Details */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Volume (m³)
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
            >
              Find Routes
            </button>
          </form>
        </div>

        {/* RIGHT PANEL - MAP */}
        <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg h-[500px]">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={5}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default Home;