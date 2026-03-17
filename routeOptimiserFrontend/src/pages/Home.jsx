import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { Truck, Globe, Zap } from "lucide-react";
import  {   useRef } from "react";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const googleApiKey =
  typeof process !== "undefined" && process.env && process.env.REACT_APP_GOOGLE_API_KEY
    ? process.env.REACT_APP_GOOGLE_API_KEY
    : import.meta.env.VITE_GOOGLE_API_KEY;

const Home = () => {
  const [formData, setFormData] = useState({
    startLat: "",
    startLon: "",
    endLat: "",
    endLon: "",
    maxDays: "",
    optimizationType: "time",
    customWeights: {
      time: 0.25,
      cost: 0.25,
      emissions: 0.25,
      logisticsScore: 0.25,
    },
    weight: "",
    volume: "",
  });

  const [initialAddress, setInitialAddress] = useState("");
  const [finalAddress, setFinalAddress] = useState("");
  const [initialCountry, setInitialCountry] = useState("");
  const [finalCountry, setFinalCountry] = useState("");
  const [routes, setRoutes] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [routeStops, setRouteStops] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const formRef = useRef(null);

  // ### Address Geocoding Functions

  // Offline Dictionary Fallback
  const CITY_GEOCODE_MAP = {
    "mumbai": { lat: 18.9667, lon: 72.8333, country: "India" },
    "bombay": { lat: 18.9667, lon: 72.8333, country: "India" },
    "new york": { lat: 40.7128, lon: -74.0060, country: "United States" },
    "new york city": { lat: 40.7128, lon: -74.0060, country: "United States" },
    "london": { lat: 51.5074, lon: -0.1278, country: "United Kingdom" },
    "singapore": { lat: 1.3521, lon: 103.8198, country: "Singapore" },
    "dubai": { lat: 25.2048, lon: 55.2708, country: "United Arab Emirates" },
    "shanghai": { lat: 31.2304, lon: 121.4737, country: "China" },
    "tokyo": { lat: 35.6764, lon: 139.6500, country: "Japan" },
    "los angeles": { lat: 34.0522, lon: -118.2437, country: "United States" },
    "rotterdam": { lat: 51.9244, lon: 4.4777, country: "Netherlands" },
    "hamburg": { lat: 53.5511, lon: 9.9937, country: "Germany" },
    "antwerp": { lat: 51.2194, lon: 4.4025, country: "Belgium" },
    "hong kong": { lat: 22.3193, lon: 114.1694, country: "China" },
    "sydney": { lat: -33.8688, lon: 151.2093, country: "Australia" },
    "capetown": { lat: -33.9249, lon: 18.4241, country: "South Africa" },
    "rio": { lat: -22.9068, lon: -43.1729, country: "Brazil" },
    "busan": { lat: 35.1796, lon: 129.0756, country: "South Korea" },
    "chicago": { lat: 41.8781, lon: -87.6298, country: "United States" }
  };


const scrollToForm = () => {
  setIsScrolling(true);

  const target = formRef.current;
  if (!target) return;

  const start = window.scrollY;
  const end = target.offsetTop;
  const duration = 1200;

  let startTime = null;

  const easeInOut = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const animateScroll = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const time = currentTime - startTime;
    const progress = Math.min(time / duration, 1);

    const eased = easeInOut(progress);

    window.scrollTo(0, start + (end - start) * eased);

    if (time < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      setIsScrolling(false); // remove blur after scroll
    }
  };

  requestAnimationFrame(animateScroll);
};

  const handleInitialSearch = async () => {
    if (!initialAddress) {
      console.error("Initial address is missing.");
      return;
    }
    const sanitizedSearch = initialAddress.trim().toLowerCase();
    const hardcodedResult = CITY_GEOCODE_MAP[sanitizedSearch];
    
    if (hardcodedResult) {
      setFormData((prev) => ({
        ...prev,
        startLat: parseFloat(hardcodedResult.lat),
        startLon: parseFloat(hardcodedResult.lon),
      }));
      setInitialCountry(hardcodedResult.country);
      return;
    }

    try {
      const response = await fetch(
        `/nominatim/search?format=json&q=${encodeURIComponent(
          initialAddress
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          startLat: parseFloat(data[0].lat),
          startLon: parseFloat(data[0].lon),
        }));
        setInitialCountry(data[0].address?.country || "");
      } else {
        alert("Address not found for Initial Position.");
      }
    } catch (error) {
      console.error("Error fetching geocode data. Try using 'Mumbai' or 'New York' instead.", error);
    }
  };

  const handleFinalSearch = async () => {
    if (!finalAddress) {
      console.error("Final address is missing.");
      return;
    }
    const sanitizedSearch = finalAddress.trim().toLowerCase();
    const hardcodedResult = CITY_GEOCODE_MAP[sanitizedSearch];

    if (hardcodedResult) {
      setFormData((prev) => ({
        ...prev,
        endLat: parseFloat(hardcodedResult.lat),
        endLon: parseFloat(hardcodedResult.lon),
      }));
      setFinalCountry(hardcodedResult.country);
      return;
    }

    try {
      const response = await fetch(
        `/nominatim/search?format=json&q=${encodeURIComponent(
          finalAddress
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          endLat: parseFloat(data[0].lat),
          endLon: parseFloat(data[0].lon),
        }));
        setFinalCountry(data[0].address?.country || "");
      } else {
        alert("Address not found for Final Position.");
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  // ### Form Submission Logic

  const sumOfWeights = Object.values(formData.customWeights).reduce(
    (acc, val) => acc + val,
    0
  );
  const isSumValid = Math.abs(sumOfWeights - 1) < 0.0001;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const dataToSend = {
      startLat: formData.startLat,
      startLon: formData.startLon,
      endLat: formData.endLat,
      endLon: formData.endLon,
      maxDays: formData.maxDays || null,
      optimizationType: formData.optimizationType,
      customWeights: formData.customWeights,
      weight: parseFloat(formData.weight),
      volume: parseFloat(formData.volume),
      initialCountry: initialCountry,
      finalCountry: finalCountry,
    };

    try {
      const response = await fetch("http://localhost:5001/api/find-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        setRoutes(result.routes);
      } else {
        alert(`Backend error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to fetch routes: ${error.message}. Ensure the backend is running on http://localhost:5001.`);
    }
  };

  // ### Route Stops Calculation

  useEffect(() => {
    if (routes.length > 0) {
      const firstRoute = routes[0];
      const intermediateStops = firstRoute.path.slice(1, -1).filter(
        (point) => point !== firstRoute.path[firstRoute.path.length - 1]
      );

      const geocodePromises = intermediateStops.map((stop) => {
        // Look up route stops in our offline DB first
        const splitStopName = stop.split('_');
        const cityName = splitStopName.length > 1 ? splitStopName[1].toLowerCase() : stop.toLowerCase();
        
        // Some nodes are returned from the backend natively with custom IDs
        // E.g. "Custom_40.7128_-74.006_End"
        if (stop.startsWith("Custom_")) {
           const parts = stop.split('_');
           if (parts.length >= 3) {
             return Promise.resolve({ name: stop, lat: parseFloat(parts[1]), lon: parseFloat(parts[2]) });
           }
        }

        if (CITY_GEOCODE_MAP[cityName]) {
             return Promise.resolve({ 
               name: stop, 
               lat: parseFloat(CITY_GEOCODE_MAP[cityName].lat), 
               lon: parseFloat(CITY_GEOCODE_MAP[cityName].lon) 
             });
        }

        // Only reach out to Nominatim if absolutely needed
        return fetch(
          `/nominatim/search?format=json&q=${encodeURIComponent(
            stop
          )}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.length > 0) {
              return { name: stop, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            } else {
              console.warn(`Geocode failed for ${stop}`);
              return null;
            }
          })
          .catch((error) => {
            console.error(`Error geocoding ${stop}:`, error);
            return null;
          });
      });

      Promise.all(geocodePromises).then((intermediateCoords) => {
        const filteredCoords = intermediateCoords.filter((coord) => coord !== null);
        const stops = [
          { name: initialAddress, lat: Number(formData.startLat), lon: Number(formData.startLon) },
          ...filteredCoords,
          { name: finalAddress, lat: Number(formData.endLat), lon: Number(formData.endLon) },
        ];
        setRouteStops(stops);
        console.log("Route Stops:", stops); // Verify data in console
      });
    }
  }, [
    routes,
    initialAddress,
    finalAddress,
    formData.startLat,
    formData.startLon,
    formData.endLat,
    formData.endLon,
  ]);

  // ### Map Bounds Adjustment Component

  const MapUpdater = ({ routeStops }) => {
    const map = useMap();
    useEffect(() => {
      if (routeStops.length > 0) {
        const bounds = routeStops.map((stop) => [Number(stop.lat), Number(stop.lon)]);
        console.log("Bounds:", bounds); // Debug coordinates
        map.fitBounds(bounds);
      }
    }, [routeStops, map]);
    return null;
  };

  // ### JSX Rendering

  // ### JSX Rendering

return (
  <div className="bg-gradient-to-br from-[#03045E] via-[#023E8A] to-[#00B4D8] min-h-screen text-white">

    {/* 🔥 HERO SECTION */}
    <section
  className={`h-screen flex flex-col justify-center items-center text-center px-6 transition-all duration-700 ${
    isScrolling ? "blur-md opacity-60 scale-105" : ""
  }`}
>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Optimize Your Cargo Routes
        </h1>

        <p className="text-xl text-[#CAF0F8] mb-2">
          Smarter. Faster. Greener.
        </p>

        <p className="text-[#ADE8F4] mb-8">
          AI-powered multimodal logistics optimization across land, sea, and air.
        </p>

        <motion.button
  onClick={scrollToForm}
  whileHover={{ scale: 1.06 }}
  whileTap={{ scale: 0.95 }}
  className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] px-6 py-3 rounded-xl font-semibold shadow-lg"
>
  Start Optimizing
</motion.button>
      </motion.div>
    </section>

    {/* 🔥 FEATURES */}
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8"
    >
      {[
        { icon: Truck, title: "Smart Routing", desc: "AI-powered route optimization" },
        { icon: Globe, title: "Global Coverage", desc: "Land, sea & air integration" },
        { icon: Zap, title: "Instant Decisions", desc: "Fast and efficient computation" },
      ].map((f, i) => (
        <motion.div
          key={i}
          variants={item}
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg"
        >
          <f.icon size={32} className="text-[#00B4D8] mb-4" />
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-[#CAF0F8] text-sm">{f.desc}</p>
        </motion.div>
      ))}
    </motion.section>

    {/* 🔥 MAIN APP */}
    <motion.div
  ref={formRef}
  initial={{ opacity: 0, y: 120, filter: "blur(10px)" }}
  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{ duration: 0.9 }}
  viewport={{ once: true }}></motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-[#023E8A]/95 text-white p-6 rounded-2xl shadow-xl border border-[#0077B6] backdrop-blur-md"
          >
            {/* 🔁 KEEP YOUR FORM EXACTLY SAME (PASTE YOUR EXISTING FORM HERE) */
              <form className="space-y-6" onSubmit={handleSubmit}>

          {/* INITIAL */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#ADE8F4]">Initial Position</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                className="mt-1 block w-full rounded-lg bg-[#CAF0F8] border border-[#90E0EF] text-[#03045E] px-3 py-2 focus:ring-2 focus:ring-[#00B4D8] outline-none"
                value={initialAddress}
                onChange={(e) => setInitialAddress(e.target.value)}
                placeholder="Enter initial address"
              />
              <button
                type="button"
                onClick={handleInitialSearch}
                className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:scale-105 text-white py-2 px-4 rounded-lg transition"
              >
                Search
              </button>
            </div>

            {formData.startLat && formData.startLon && (
              <div className="mt-2 text-sm text-[#ADE8F4]">
                <p>Latitude: {formData.startLat}</p>
                <p>Longitude: {formData.startLon}</p>
                <p>Country: {initialCountry}</p>
              </div>
            )}
          </div>

          {/* FINAL */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#ADE8F4]">Final Position</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                className="mt-1 block w-full rounded-lg bg-[#CAF0F8] border border-[#90E0EF] text-[#03045E] px-3 py-2 focus:ring-2 focus:ring-[#00B4D8] outline-none"
                value={finalAddress}
                onChange={(e) => setFinalAddress(e.target.value)}
                placeholder="Enter final address"
              />
              <button
                type="button"
                onClick={handleFinalSearch}
                className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:scale-105 text-white py-2 px-4 rounded-lg transition"
              >
                Search
              </button>
            </div>

            {formData.endLat && formData.endLon && (
              <div className="mt-2 text-sm text-[#ADE8F4]">
                <p>Latitude: {formData.endLat}</p>
                <p>Longitude: {formData.endLon}</p>
                <p>Country: {finalCountry}</p>
              </div>
            )}
          </div>

          {/* MAX DAYS */}
          <div>
            <label className="block text-sm text-[#ADE8F4]">
              Max Days (Optional)
            </label>
            <input
              type="number"
              min="1"
              className="mt-1 block w-full rounded-lg bg-[#CAF0F8] border border-[#90E0EF] text-[#03045E] px-3 py-2"
              value={formData.maxDays}
              onChange={(e) =>
                setFormData({ ...formData, maxDays: e.target.value })
              }
            />
          </div>

          {/* OPTIMIZATION */}
          <div>
            <h3 className="text-lg font-medium mb-2 text-[#ADE8F4]">
              Preferred Optimization
            </h3>
            <div className="space-y-2">
              {["time", "cost", "emissions", "logisticsScore", "customWeights"].map(
                (option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="optimizationType"
                      value={option}
                      checked={formData.optimizationType === option}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          optimizationType: e.target.value,
                        })
                      }
                      className="accent-[#00B4D8]"
                    />
                    <span className="ml-2 capitalize text-[#ADE8F4]">
                      {option.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* CUSTOM WEIGHTS */}
          {formData.optimizationType === "customWeights" && (
            <div className="space-y-4">
              <h4 className="text-sm text-[#ADE8F4]">
                Custom Weights (Sum must equal 1)
              </h4>
              {Object.keys(formData.customWeights).map((weight) => (
                <div key={weight}>
                  <label className="block text-sm text-[#ADE8F4] capitalize">
                    {weight.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    className="mt-1 block w-full rounded-lg bg-[#CAF0F8] border border-[#90E0EF] text-[#03045E] px-3 py-2"
                    value={formData.customWeights[weight]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customWeights: {
                          ...formData.customWeights,
                          [weight]: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              ))}
              <div>
                <p className="text-sm text-[#ADE8F4]">
                  Current sum: {sumOfWeights.toFixed(2)}
                </p>
                {!isSumValid && (
                  <p className="text-red-400 text-sm">
                    Sum of weights must equal 1
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SHIPMENT */}
          <div className="space-y-4">
            <h3 className="text-lg text-[#ADE8F4]">Shipment Measurements</h3>

            <div>
              <label className="text-sm text-[#ADE8F4]">Weight (kg)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg bg-[#CAF0F8] border border-[#90E0EF] text-[#03045E] px-3 py-2"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-[#ADE8F4]">Volume (m³)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg bg-[#CAF0F8] border border-[#90E0EF] text-[#03045E] px-3 py-2"
                value={formData.volume}
                onChange={(e) =>
                  setFormData({ ...formData, volume: e.target.value })
                }
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] hover:scale-[1.02] text-white py-2 px-4 rounded-lg transition shadow-md"
            disabled={
              (formData.optimizationType === "customWeights" && !isSumValid) ||
              !formData.startLat ||
              !formData.startLon ||
              !formData.endLat ||
              !formData.endLon ||
              !formData.weight ||
              !formData.volume
            }
          >
            Find Optimal Routes
          </button>
        </form>
            }
          </motion.div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">

            {/* MAP */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="bg-[#023E8A]/90 p-4 rounded-2xl h-[400px] border border-[#0077B6] shadow-lg"
            >
              <MapContainer
                center={
                  routeStops.length > 0
                    ? [Number(routeStops[0].lat), Number(routeStops[0].lon)]
                    : [51.505, -0.09]
                }
                zoom={13}
                className="h-full w-full rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {routeStops.length > 0 ? (
                  <>
                    {routeStops.map((stop, index) => (
                      <Marker key={index} position={[Number(stop.lat), Number(stop.lon)]}>
                        <Popup>{stop.name}</Popup>
                      </Marker>
                    ))}
                    {routeStops.length > 1 && (
                      <Polyline
                        positions={routeStops.map((s) => [Number(s.lat), Number(s.lon)])}
                        color="#00B4D8"
                        weight={4}
                        opacity={1}
                        dashArray="5,10"
                      />
                    )}
                    <MapUpdater routeStops={routeStops} />
                  </>
                ) : (
                  <>
                    {formData.startLat && (
                      <Marker position={[Number(formData.startLat), Number(formData.startLon)]}>
                        <Popup>Start: {initialAddress}</Popup>
                      </Marker>
                    )}
                    {formData.endLat && (
                      <Marker position={[Number(formData.endLat), Number(formData.endLon)]}>
                        <Popup>End: {finalAddress}</Popup>
                      </Marker>
                    )}
                  </>
                )}
              </MapContainer>
            </motion.div>

            {/* ROUTES */}
            <div className="grid grid-cols-1 gap-4">
              {routes.length > 0 ? (
                routes.map((route) => (
                  <motion.div
                    key={route.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#023E8A]/95 p-5 rounded-2xl text-[#CAF0F8] shadow-lg border border-[#0077B6]"
                  >
                    <div className="flex justify-between pb-4 border-b border-[#0077B6]">
                      <h3 className="text-2xl font-bold">Route {route.rank}</h3>
                      <div className="text-right text-[#90E0EF]">
                        <p>Cost: ${route.cost.toLocaleString()}</p>
                        <p>Time: {route.time_days} days</p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-[#03045E] rounded-lg">
                      <p className="text-lg font-semibold">
                        {[initialAddress, ...(route.path.slice(1, -1)), finalAddress].join(" → ")}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-[#ADE8F4]">
                        Carbon: {route.emissions} kg CO₂
                      </p>
                      <div className="w-full bg-[#03045E] h-2 mt-1 rounded-full">
                        <div
                          className="bg-[#00B4D8] h-2 rounded-full"
                          style={{ width: `${Math.min(route.emissions / 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : hasSubmitted ? (
                <p className="text-[#03045E]">No routes found.</p>
              ) : (
                <p className="text-[#03045E]">Submit the form to find optimal routes.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  // </div>
);
};

export default Home;