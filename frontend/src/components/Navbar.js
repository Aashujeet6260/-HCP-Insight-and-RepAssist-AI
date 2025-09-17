import React from 'react';
import { BarChart2 } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-8 h-8 text-brand-blue" />
            <span className="text-xl font-bold text-text-primary">AI-HCP CRM</span>
          </div>
          <nav className="flex space-x-6 text-text-secondary font-medium">
            <a href="#" className="hover:text-brand-blue">Dashboard</a>
            <a href="#" className="text-brand-blue border-b-2 border-brand-blue pb-1">Interactions</a>
            <a href="#" className="hover:text-brand-blue">HCPs</a>
            <a href="#" className="hover:text-brand-blue">Reports</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;