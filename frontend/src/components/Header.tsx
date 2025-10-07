import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Home, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling down (opposite of before)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY < 50) {
        setIsVisible(true);
      }
      
      // Add scrolled state for styling
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <header
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[98%] max-w-7xl z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm shadow-md border border-gray-100'
      } rounded-3xl mt-4`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/1.png" 
                alt="Calories Advisor Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 italic font-serif">
              Calories Advisor
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              to="/analyze"
              className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/analyze'
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Analyze</span>
            </Link>
            
            <Link
              to="/settings"
              className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === '/settings'
                  ? 'bg-primary-100 text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-sm'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
