


import React, { useState } from "react";
import {
  Home,
  Info,
  Calendar,
  FileText,
  Award,
  Users,
  PhoneCall,
  Menu,
  X,
  Image,
  Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { name: "Home", icon: Home },
  { name: "About", icon: Info },
  { name: "Schedule", icon: Calendar },
  { name: "Road Map", icon: Map },
  { name: "Guidelines", icon: FileText },
  { name: "Gallery", icon: Image },
  { name: "Speakers", icon: Users },
  { name: "Contact", icon: PhoneCall },
];

export function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => onSectionChange(item.name)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                activeSection === item.name
                  ? "text-red-800 bg-red-50"
                  : "text-gray-600 hover:text-red-800 hover:bg-red-50"
              }`}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-red-800 hover:bg-red-50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute left-0 right-0 bg-white shadow-lg z-20"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        onSectionChange(item.name);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeSection === item.name
                          ? "text-red-800 bg-red-50"
                          : "text-gray-600 hover:text-red-800 hover:bg-red-50"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}