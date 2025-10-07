import React, { useState, useEffect, useRef } from 'react';
import { Upload, Sparkles, Zap, Camera, Image as ImageIcon } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import AnalysisDisplay from '../components/AnalysisDisplay';
import { analyzeImage } from '../services/api';

interface AnalysisResult {
  success: boolean;
  analysis: string;
  filename: string;
  content_type: string;
}

const AnalysisPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const headerRef = useRef<HTMLElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLElement>(null);

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

    const elements = [headerRef.current, uploadRef.current, resultsRef.current, tipsRef.current].filter(Boolean);
    elements.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [result]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await analyzeImage(file);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAnother = () => {
    setResult(null);
    setError(null);
    setSelectedFile(null);
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
            {/* Animated Icon */}
            <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-lg animate-bounce-gentle">
              <Camera className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 w-4 h-4 xs:w-6 xs:h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                <Sparkles className="w-2 h-2 xs:w-3 xs:h-3 text-white" />
              </div>
            </div>

            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-2">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent animate-gradient-x">
                Food Analysis
              </span>
            </h1>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Upload a clear photo of your food to get instant calorie analysis 
              and nutritional insights powered by AI.
            </p>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 animate-fade-in-up">
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-sm sm:text-base font-semibold text-red-800">
                    Analysis Failed
                  </h3>
                  <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {!selectedFile && (
          <div ref={uploadRef} className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
        )}

        {/* Selected Image Display */}
        {selectedFile && (
          <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 animate-fade-in-up">
            <div className="w-full max-w-3xl mx-auto">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-primary-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base sm:text-lg">{selectedFile.name}</p>
                        <p className="text-sm sm:text-base text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Uploaded food"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>{result ? 'Analyzed' : 'Ready for Analysis'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        <div ref={resultsRef}>
          <AnalysisDisplay result={result} isLoading={isLoading} />
        </div>

        {/* Action Buttons */}
        {result && (
          <div className="flex justify-center mt-6 sm:mt-8 md:mt-12 animate-fade-in-up">
            <button
              onClick={handleAnalyzeAnother}
              className="group btn-secondary inline-flex items-center text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mr-2 xs:mr-3 group-hover:animate-pulse" />
              <span className="hidden xs:inline">Analyze Another Image</span>
              <span className="xs:hidden">Analyze Another</span>
            </button>
          </div>
        )}

        {/* Tips Section */}
        {!result && !isLoading && (
          <section ref={tipsRef} className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 max-w-5xl mx-auto">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-2xl sm:rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-12 lg:p-16 shadow-2xl">
                <div className="text-center mb-6 sm:mb-8 md:mb-12">
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                    <Zap className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                    Tips for <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Best Results</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                      <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                        <span className="text-xs xs:text-sm sm:text-base font-bold text-primary-600">1</span>
                      </div>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        Use good lighting to ensure all food items are clearly visible
                      </p>
                    </div>
                    
                    <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                      <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                        <span className="text-xs xs:text-sm sm:text-base font-bold text-primary-600">2</span>
                      </div>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        Capture the food from above for better recognition
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                      <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                        <span className="text-xs xs:text-sm sm:text-base font-bold text-primary-600">3</span>
                      </div>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        Include all food items in a single photo when possible
                      </p>
                    </div>
                    
                    <div className="group flex items-start space-x-3 sm:space-x-4 transform hover:scale-105 transition-all duration-300">
                      <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:animate-bounce">
                        <span className="text-xs xs:text-sm sm:text-base font-bold text-primary-600">4</span>
                      </div>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        Avoid blurry or dark images for accurate analysis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
