import React, { useState, useRef, useEffect } from 'react';
import { Camera, Sparkles, Zap, ArrowLeft, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import WebcamCapture from '../components/WebcamCapture';

const WebcamDemoPage: React.FC = () => {
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

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

    const elements = [headerRef.current, featuresRef.current, demoRef.current].filter(Boolean);
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleWebcamCapture = (file: File) => {
    setCapturedFile(file);
    setShowWebcam(false);
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const openWebcam = () => {
    setShowWebcam(true);
  };

  const closeWebcam = () => {
    setShowWebcam(false);
  };

  const resetDemo = () => {
    setCapturedFile(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 xs:-top-40 -right-20 xs:-right-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 xs:-bottom-40 -left-20 xs:-left-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 xs:top-40 left-1/2 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {/* Header */}
        <header ref={headerRef} className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="text-center">
            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Link
                to="/"
                className="group inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
              </Link>
            </div>

            {/* Animated Icon */}
            <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-lg animate-bounce-gentle">
              <Camera className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-primary-600 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent animate-gradient-x">
                Webcam Capture
              </span>
              <span className="block sm:inline bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x animation-delay-1000">
                Demo
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed animate-fade-in-up animation-delay-500">
              Experience our advanced webcam capture technology, similar to ChatGPT and Gemini. 
              Tap to capture, switch cameras, and get instant food analysis.
            </p>
          </div>
        </header>

        {/* Features Section */}
        <section ref={featuresRef} className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="group card-hover text-center p-6 sm:p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:animate-bounce">
                <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-300">
                Tap to Capture
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Simply tap anywhere on the video feed to capture your food image instantly, just like ChatGPT and Gemini.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group card-hover text-center p-6 sm:p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:animate-bounce">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                Camera Switching
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Switch between front and back cameras seamlessly. Automatically detects available cameras on your device.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group card-hover text-center p-6 sm:p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:animate-bounce">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors duration-300">
                Instant Analysis
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Get immediate calorie analysis and nutritional insights from your captured food images with AI-powered recognition.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section ref={demoRef} className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Try the <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Webcam Capture</span>
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Click the button below to open the webcam interface and experience our advanced capture technology.
            </p>
          </div>

          {/* Demo Button */}
          {!capturedFile && (
            <div className="flex justify-center mb-8 sm:mb-12">
              <button
                onClick={openWebcam}
                className="group btn-primary inline-flex items-center text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                Open Webcam Demo
              </button>
            </div>
          )}

          {/* Captured Image Display */}
          {capturedFile && (
            <div className="max-w-2xl mx-auto mb-8 sm:mb-12 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-primary-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                        <Camera className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base sm:text-lg">{capturedFile.name}</p>
                        <p className="text-sm sm:text-base text-gray-500">
                          {(capturedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
                    <img
                      src={URL.createObjectURL(capturedFile)}
                      alt="Captured food"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Captured Successfully</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                      to="/analyze"
                      className="group btn-primary inline-flex items-center justify-center text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                      Analyze This Image
                    </Link>
                    <button
                      onClick={resetDemo}
                      className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Technical Details */}
        <section className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-2xl sm:rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="text-center mb-6 sm:mb-8 md:mb-12">
                <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                  <Monitor className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-primary-600" />
                </div>
                <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                  Technical <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Features</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                <div className="space-y-4 sm:space-y-6">
                  <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-primary-600">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 mb-1">High-Quality Capture</h4>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
                        Captures images at up to 1920x1080 resolution with optimized compression
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-primary-600">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 mb-1">Cross-Platform</h4>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
                        Works seamlessly on desktop, mobile, and tablet devices
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-primary-600">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 mb-1">Smart Detection</h4>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
                        Automatically detects available cameras and optimizes settings
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-primary-600">✓</span>
                    </div>
                    <div>
                      <h4 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-900 mb-1">Error Handling</h4>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
                        Graceful fallbacks and user-friendly error messages
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Webcam Modal */}
      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={closeWebcam}
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
};

export default WebcamDemoPage;
