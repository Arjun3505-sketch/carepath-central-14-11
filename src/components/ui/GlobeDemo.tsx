import React from "react";
import { motion } from "framer-motion";
import { World } from "./globe.tsx";

export function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#0a1929",
    showAtmosphere: true,
    atmosphereColor: "#3b82f6",
    atmosphereAltitude: 0.15,
    emissive: "#0a1929",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(100, 180, 255, 0.8)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.3,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899"];
  
  const sampleArcs = [
    {
      order: 1,
      startLat: 40.7128, // New York
      startLng: -74.006,
      endLat: 51.5074, // London
      endLng: -0.1278,
      arcAlt: 0.3,
      color: colors[0],
    },
    {
      order: 1,
      startLat: 28.6139, // Delhi
      startLng: 77.209,
      endLat: 35.6762, // Tokyo
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[1],
    },
    {
      order: 2,
      startLat: -33.8688, // Sydney
      startLng: 151.2093,
      endLat: 1.3521, // Singapore
      endLng: 103.8198,
      arcAlt: 0.3,
      color: colors[2],
    },
    {
      order: 2,
      startLat: 51.5074, // London
      startLng: -0.1278,
      endLat: -23.5505, // São Paulo
      endLng: -46.6333,
      arcAlt: 0.4,
      color: colors[3],
    },
    {
      order: 3,
      startLat: 37.7749, // San Francisco
      startLng: -122.4194,
      endLat: 48.8566, // Paris
      endLng: 2.3522,
      arcAlt: 0.35,
      color: colors[4],
    },
    {
      order: 3,
      startLat: 22.3193, // Hong Kong
      startLng: 114.1694,
      endLat: 40.7128, // New York
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[0],
    },
    {
      order: 4,
      startLat: -34.6037, // Buenos Aires
      startLng: -58.3816,
      endLat: 35.6762, // Tokyo
      endLng: 139.6503,
      arcAlt: 0.6,
      color: colors[1],
    },
    {
      order: 4,
      startLat: 19.4326, // Mexico City
      startLng: -99.1332,
      endLat: 28.6139, // Delhi
      endLng: 77.209,
      arcAlt: 0.4,
      color: colors[2],
    },
    {
      order: 5,
      startLat: 55.7558, // Moscow
      startLng: 37.6173,
      endLat: -33.8688, // Sydney
      endLng: 151.2093,
      arcAlt: 0.5,
      color: colors[3],
    },
    {
      order: 5,
      startLat: 25.2048, // Dubai
      startLng: 55.2708,
      endLat: 37.7749, // San Francisco
      endLng: -122.4194,
      arcAlt: 0.45,
      color: colors[4],
    },
    {
      order: 6,
      startLat: -1.2921, // Nairobi
      startLng: 36.8219,
      endLat: 51.5074, // London
      endLng: -0.1278,
      arcAlt: 0.25,
      color: colors[0],
    },
    {
      order: 6,
      startLat: 31.2304, // Shanghai
      startLng: 121.4737,
      endLat: 48.8566, // Paris
      endLng: 2.3522,
      arcAlt: 0.4,
      color: colors[1],
    },
    {
      order: 7,
      startLat: 13.7563, // Bangkok
      startLng: 100.5018,
      endLat: -26.2041, // Johannesburg
      endLng: 28.0473,
      arcAlt: 0.5,
      color: colors[2],
    },
    {
      order: 7,
      startLat: 45.5017, // Montreal
      startLng: -73.5673,
      endLat: 55.7558, // Moscow
      endLng: 37.6173,
      arcAlt: 0.4,
      color: colors[3],
    },
    {
      order: 8,
      startLat: -37.8136, // Melbourne
      startLng: 144.9631,
      endLat: 25.2048, // Dubai
      endLng: 55.2708,
      arcAlt: 0.55,
      color: colors[4],
    },
    {
      order: 8,
      startLat: 39.9042, // Beijing
      startLng: 116.4074,
      endLat: -34.6037, // Buenos Aires
      endLng: -58.3816,
      arcAlt: 0.65,
      color: colors[0],
    },
    {
      order: 9,
      startLat: 6.5244, // Lagos
      startLng: 3.3792,
      endLat: 31.2304, // Shanghai
      endLng: 121.4737,
      arcAlt: 0.5,
      color: colors[1],
    },
    {
      order: 9,
      startLat: 41.9028, // Rome
      startLng: 12.4964,
      endLat: 13.7563, // Bangkok
      endLng: 100.5018,
      arcAlt: 0.45,
      color: colors[2],
    },
    {
      order: 10,
      startLat: -22.9068, // Rio de Janeiro
      startLng: -43.1729,
      endLat: 1.3521, // Singapore
      endLng: 103.8198,
      arcAlt: 0.7,
      color: colors[3],
    },
    {
      order: 10,
      startLat: 52.52, // Berlin
      startLng: 13.405,
      endLat: -1.2921, // Nairobi
      endLng: 36.8219,
      arcAlt: 0.35,
      color: colors[4],
    },
    {
      order: 11,
      startLat: 19.076, // Mumbai
      startLng: 72.8777,
      endLat: 51.5074, // London
      endLng: -0.1278,
      arcAlt: 0.4,
      color: colors[0],
    },
    {
      order: 11,
      startLat: 12.9716, // Bangalore
      startLng: 77.5946,
      endLat: 37.7749, // San Francisco
      endLng: -122.4194,
      arcAlt: 0.5,
      color: colors[1],
    },
    {
      order: 12,
      startLat: 13.0827, // Chennai
      startLng: 80.2707,
      endLat: 1.3521, // Singapore
      endLng: 103.8198,
      arcAlt: 0.25,
      color: colors[2],
    },
    {
      order: 12,
      startLat: 22.5726, // Kolkata
      startLng: 88.3639,
      endLat: 25.2048, // Dubai
      endLng: 55.2708,
      arcAlt: 0.35,
      color: colors[3],
    },
    {
      order: 13,
      startLat: 17.385, // Hyderabad
      startLng: 78.4867,
      endLat: 35.6762, // Tokyo
      endLng: 139.6503,
      arcAlt: 0.45,
      color: colors[4],
    },
    {
      order: 13,
      startLat: 28.6139, // Delhi
      startLng: 77.209,
      endLat: -33.8688, // Sydney
      endLng: 151.2093,
      arcAlt: 0.6,
      color: colors[0],
    },
  ];

  return (
    <div className="flex flex-row items-center justify-center w-full h-full relative">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="mb-8"
        >
          <h2 className="text-center text-xl md:text-3xl font-bold text-white">
            Healthcare Worldwide
          </h2>
          <p className="text-center text-sm md:text-base font-normal text-neutral-300 max-w-md mt-2 mx-auto">
            Secure and accessible healthcare records across the globe
          </p>
        </motion.div>
        <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent to-slate-900 z-40" />
        <div className="absolute w-full -bottom-20 h-72 md:h-full z-10">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
