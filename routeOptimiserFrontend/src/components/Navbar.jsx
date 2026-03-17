import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <nav className="bg-[#03045E]/90 backdrop-blur-sm border-b border-[#0077B6]/40 top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src="/src/assets/logo.png"
                alt="Logo"
                className="h-8 w-8 mr-2"
              />
              <span className="text-xl font-bold text-[#CAF0F8] group-hover:text-[#48CAE4] transition duration-300">
                Route Nova
              </span>
            </Link>
          </div>

          {/* NAV LINKS */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-[#ADE8F4] hover:text-[#48CAE4] transition-colors"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-[#ADE8F4] hover:text-[#48CAE4] transition-colors"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-[#ADE8F4] hover:text-[#48CAE4] transition-colors"
            >
              Contact
            </Link>

            {!isAuthenticated ? (
              <>
                {/* Same logic, just UI colors changed */}
                {/*
                <Link
                  to="/login"
                  className="text-[#ADE8F4] hover:text-[#48CAE4]"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-[#0077B6] hover:bg-[#0096C7] text-white px-4 py-2 rounded-md transition"
                >
                  Sign Up
                </Link>
                */}
              </>
            ) : (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-[#ADE8F4] hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;