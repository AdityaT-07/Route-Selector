import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-[#03045E] via-[#023E8A] to-[#00B4D8]">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-xl"
      >
        <h1 className="text-5xl font-bold mb-6 text-white">
          About Route Nova
        </h1>

        <p className="text-[#CAF0F8] text-lg leading-relaxed">
          Route Nova is a multimodal cargo route optimization platform that helps businesses
          find the most efficient routes using land, sea, and air transportation.
          Our system leverages intelligent optimization to reduce cost, time, and emissions.
        </p>
      </motion.div>

    </div>
  );
};

export default About;