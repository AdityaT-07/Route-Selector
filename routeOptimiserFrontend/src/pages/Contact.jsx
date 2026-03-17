import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#03045E] via-[#023E8A] to-[#00B4D8]">

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-white"
      >
        Contact Us
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 rounded-lg bg-[#CAF0F8] text-[#03045E] focus:ring-2 focus:ring-[#00B4D8] outline-none"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-[#CAF0F8] text-[#03045E] focus:ring-2 focus:ring-[#00B4D8] outline-none"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <textarea
            rows={4}
            placeholder="Message"
            className="w-full px-4 py-2 rounded-lg bg-[#CAF0F8] text-[#03045E] focus:ring-2 focus:ring-[#00B4D8] outline-none"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] py-2 rounded-xl text-white"
          >
            Send Message
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
};

export default Contact;