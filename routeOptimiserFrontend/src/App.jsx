import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#03045E] via-[#023E8A] to-[#00B4D8] text-white">
        
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/login" 
              element={<Login setIsAuthenticated={setIsAuthenticated} />} 
            />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </motion.div>

      </div>
    </Router>
  );
};

export default App;