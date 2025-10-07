import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, BarChart3, Heart, Zap, ArrowRight, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    const elements = [heroRef.current, featuresRef.current, ctaRef.current].filter(Boolean);
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 xs:-top-40 -right-20 xs:-right-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 xs:-bottom-40 -left-20 xs:-left-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 xs:top-40 left-1/2 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 sm:mb-12 md:mb-16">
            {/* Animated Icon */}
            <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-lg animate-bounce-gentle">
              <Camera className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-primary-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 w-4 h-4 xs:w-6 xs:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <Sparkles className="w-2 h-2 xs:w-3 xs:h-3 text-white" />
              </div>
            </div>
            
            {/* Main Heading with Gradient */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent animate-gradient-x">
                Get Instant Calorie
              </span>
              <span className="block sm:inline bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent animate-gradient-x animation-delay-1000">
                Analysis
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed animate-fade-in-up animation-delay-500">
              Upload a photo of your food or capture it with your camera and get detailed nutritional information, 
              calorie breakdown, and health recommendations powered by AI.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 sm:gap-6 justify-center items-center px-4 sm:px-0 animate-fade-in-up animation-delay-1000">
              <Link
                to="/analyze"
                className="group btn-primary text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 inline-flex items-center justify-center w-full xs:w-auto min-w-[200px] xs:min-w-[220px] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Camera className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mr-2 xs:mr-3 group-hover:animate-pulse" />
                <span className="hidden xs:inline">Analyze Your Food</span>
                <span className="xs:hidden">Analyze Food</span>
                <ArrowRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 ml-2 xs:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button className="group btn-secondary text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 w-full xs:w-auto min-w-[200px] xs:min-w-[220px] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="group-hover:text-primary-600 transition-colors duration-300">Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-4 sm:px-0">
              Why Choose <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">Calories Advisor</span>?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
              Our AI-powered platform provides accurate, instant nutritional analysis 
              to help you make informed dietary choices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Feature 1 */}
            <div className="group card-hover text-center p-4 xs:p-6 sm:p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 xs:mb-6 sm:mb-8 shadow-lg group-hover:animate-bounce">
                <BarChart3 className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-primary-600" />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-2 xs:mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors duration-300">
                Accurate Calorie Analysis
              </h3>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Get precise calorie counts and detailed nutritional breakdowns 
                for every food item in your image.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group card-hover text-center p-4 xs:p-6 sm:p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 xs:mb-6 sm:mb-8 shadow-lg group-hover:animate-bounce">
                <Heart className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-2 xs:mb-3 sm:mb-4 group-hover:text-green-600 transition-colors duration-300">
                Health Recommendations
              </h3>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Receive personalized health tips and suggestions to improve 
                your dietary choices and overall wellness.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group card-hover text-center p-4 xs:p-6 sm:p-8 sm:col-span-2 lg:col-span-1 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 xs:mb-6 sm:mb-8 shadow-lg group-hover:animate-bounce">
                <Zap className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-orange-600" />
              </div>
              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 mb-2 xs:mb-3 sm:mb-4 group-hover:text-orange-600 transition-colors duration-300">
                Instant Results
              </h3>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Get your nutritional analysis in seconds with our advanced 
                AI technology. No waiting, no hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-green-100/50 rounded-2xl sm:rounded-3xl transform rotate-1 scale-105"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-12 lg:p-16 shadow-2xl">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Ready to Start Your <span className="bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">Health Journey</span>?
              </h2>
              <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                Join thousands of users who are making better dietary choices 
                with instant nutritional insights.
              </p>
              <Link
                to="/analyze"
                className="group btn-primary text-base xs:text-lg sm:text-xl px-8 xs:px-10 sm:px-12 py-4 xs:py-5 sm:py-6 inline-flex items-center justify-center w-full sm:w-auto min-w-[220px] xs:min-w-[250px] transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <Camera className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 mr-2 xs:mr-3 group-hover:animate-pulse" />
                <span className="hidden xs:inline">Analyze Your First Meal</span>
                <span className="xs:hidden">Analyze First Meal</span>
                <ArrowRight className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 ml-2 xs:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
