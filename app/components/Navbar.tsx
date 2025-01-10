"use client"
import React, { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
            API Store
          
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition">
              Home
            
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-600 transition">
              Products
            
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600 transition">
              About
            
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition">
              Contact
            
          </Link>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="space-y-4 py-4 px-4">
            <li>
              <Link href="/"
                
                  className="block text-gray-600 hover:text-blue-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                
              </Link>
            </li>
            <li>
              <Link href="/products"
                  className="block text-gray-600 hover:text-blue-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                              </Link>
            </li>
            <li>
              <Link href="/about"
                  className="block text-gray-600 hover:text-blue-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                
              </Link>
            </li>
            <li>
              <Link href="/contact"
                  className="block text-gray-600 hover:text-blue-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
