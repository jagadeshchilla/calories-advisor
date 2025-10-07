import React, { useState, useEffect, useRef } from 'react';
import { Settings, Key, CheckCircle, AlertCircle, Eye, EyeOff, ExternalLink, Copy, Trash2, Save, Cpu } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [, setIsSaved] = useState(false);
  const [selectedModel, setSelectedModel] = useState('models/gemma-3-27b-it');
  const [isSaving, setIsSaving] = useState(false);
  const settingsRef = useRef<HTMLElement>(null);

  // Available models
  const availableModels = [
    { id: 'models/gemma-3-27b-it', name: 'Gemma 3 27B IT', description: 'Default - Most capable model' },
    { id: 'models/gemma-3-12b-it', name: 'Gemma 3 12B IT', description: 'Balanced performance and speed' },
    { id: 'models/gemini-robotics-er-1.5-preview', name: 'Gemini Robotics ER 1.5', description: 'Specialized for robotics tasks' },
    { id: 'models/gemma-3n-e4b-it', name: 'Gemma 3N E4B IT', description: 'Efficient smaller model' }
  ];

  useEffect(() => {
    // Load saved API key and model from localStorage
    const savedApiKey = localStorage.getItem('gemini_api_key');
    const savedModel = localStorage.getItem('gemini_model');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setValidationStatus('valid');
    }
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }

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

    if (settingsRef.current) {
      observer.observe(settingsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationMessage('Please enter an API key');
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');

    try {
      // Test the API key by making a simple request to Gemini
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
      
      if (response.ok) {
        setValidationStatus('valid');
        setValidationMessage('API key is valid and working!');
        setIsSaved(true);
        localStorage.setItem('gemini_api_key', apiKey);
      } else {
        setValidationStatus('invalid');
        setValidationMessage('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      setValidationStatus('invalid');
      setValidationMessage('Error validating API key. Please check your connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Save API key and model to localStorage
      if (apiKey.trim()) {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('gemini_model', selectedModel);
        
        setIsSaved(true);
        setValidationMessage('Settings saved successfully!');
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setValidationMessage('Please enter an API key before saving');
        setValidationStatus('invalid');
      }
    } catch (error) {
      setValidationMessage('Error saving settings');
      setValidationStatus('invalid');
    } finally {
      setIsSaving(false);
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setValidationStatus('idle');
    setValidationMessage('');
    setIsSaved(false);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsSaved(true);
    setValidationMessage('API key copied to clipboard!');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const openGeminiConsole = () => {
    window.open('https://makersuite.google.com/app/apikey', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 xs:-top-40 -right-20 xs:-right-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 xs:-bottom-40 -left-20 xs:-left-40 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 xs:top-40 left-1/2 w-40 xs:w-60 sm:w-80 h-40 xs:h-60 sm:h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 xs:opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Settings Section */}
      <section ref={settingsRef} className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 shadow-lg animate-bounce-gentle">
              <Settings className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-primary-600" />
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-4 sm:px-0">
              Configure your Gemini API key to enable AI-powered food analysis
            </p>
          </div>

          {/* API Key Configuration Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-2xl sm:rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Key className="w-5 h-5 xs:w-6 xs:h-6 text-blue-600" />
                </div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">
                  <span className="bg-gradient-to-r from-blue-600 to-primary-600 bg-clip-text text-transparent">
                    API Configuration
                  </span>
                </h2>
              </div>

              {/* API Key Input */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Gemini API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key..."
                      className="w-full px-3 xs:px-4 py-2 xs:py-3 pr-16 xs:pr-20 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 xs:right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4 xs:w-5 xs:h-5" /> : <Eye className="w-4 h-4 xs:w-5 xs:h-5" />}
                    </button>
                  </div>
                </div>

                {/* Validation Status */}
                {validationMessage && (
                  <div className={`flex items-start sm:items-center space-x-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                    validationStatus === 'valid' ? 'bg-green-50 text-green-700' : 
                    validationStatus === 'invalid' ? 'bg-red-50 text-red-700' : 
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {validationStatus === 'valid' ? (
                      <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                    ) : validationStatus === 'invalid' ? (
                      <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                    ) : (
                      <Key className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                    )}
                    <span className="text-xs xs:text-sm font-medium">{validationMessage}</span>
                  </div>
                )}

                {/* Model Selection */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                    AI Model Selection
                  </label>
                  <div className="relative">
                    <select
                      id="model"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-3 xs:px-4 py-2 xs:py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base appearance-none cursor-pointer"
                    >
                      {availableModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.description}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 xs:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Cpu className="w-4 h-4 xs:w-5 xs:h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
                  <button
                    onClick={saveSettings}
                    disabled={isSaving || !apiKey.trim()}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 xs:px-6 py-2 xs:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm xs:text-base">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 xs:w-5 xs:h-5" />
                        <span className="text-sm xs:text-base">Save Settings</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={validateApiKey}
                    disabled={isValidating || !apiKey.trim()}
                    className="flex items-center justify-center space-x-2 px-3 xs:px-4 py-2 xs:py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl sm:rounded-2xl font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isValidating ? (
                      <>
                        <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden xs:inline text-sm">Validating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                        <span className="hidden xs:inline text-sm">Validate</span>
                      </>
                    )}
                  </button>

                  {apiKey && (
                    <>
                      <button
                        onClick={copyApiKey}
                        className="flex items-center justify-center space-x-2 px-3 xs:px-4 py-2 xs:py-3 bg-gray-100 text-gray-700 rounded-xl sm:rounded-2xl font-medium hover:bg-gray-200 transition-all duration-300"
                      >
                        <Copy className="w-4 h-4 xs:w-5 xs:h-5" />
                        <span className="hidden xs:inline text-sm">Copy</span>
                      </button>
                      <button
                        onClick={clearApiKey}
                        className="flex items-center justify-center space-x-2 px-3 xs:px-4 py-2 xs:py-3 bg-red-100 text-red-700 rounded-xl sm:rounded-2xl font-medium hover:bg-red-200 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 xs:w-5 xs:h-5" />
                        <span className="hidden xs:inline text-sm">Clear</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="mt-8 sm:mt-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 to-blue-100/30 rounded-2xl sm:rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 xs:p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <ExternalLink className="w-5 h-5 xs:w-6 xs:h-6 text-green-600" />
                </div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    How to Get Your API Key
                  </span>
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm xs:text-base font-semibold text-gray-900">Step 1: Visit Google AI Studio</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Go to Google AI Studio to create and manage your API keys for Gemini models.
                    </p>
                    <button
                      onClick={openGeminiConsole}
                      className="flex items-center space-x-2 px-3 xs:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg xs:rounded-xl font-medium hover:bg-blue-200 transition-all duration-300"
                    >
                      <ExternalLink className="w-3 h-3 xs:w-4 xs:h-4" />
                      <span className="text-xs xs:text-sm">Open Google AI Studio</span>
                    </button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm xs:text-base font-semibold text-gray-900">Step 2: Create API Key</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Sign in with your Google account and click "Create API Key" to generate a new key.
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm xs:text-base font-semibold text-gray-900">Step 3: Copy & Paste</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Copy the generated API key and paste it in the field above, then click "Validate & Save".
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm xs:text-base font-semibold text-gray-900">Step 4: Start Analyzing</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Once validated, you can start uploading food images for AI-powered calorie analysis!
                    </p>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h4 className="text-sm xs:text-base font-semibold text-yellow-800 mb-2 sm:mb-3">Important Notes:</h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs text-yellow-700">
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-yellow-500 rounded-full mt-1.5 xs:mt-2 flex-shrink-0"></span>
                      <span>Your API key is stored locally in your browser and never shared with our servers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-yellow-500 rounded-full mt-1.5 xs:mt-2 flex-shrink-0"></span>
                      <span>Google AI Studio may have usage limits and billing requirements</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-yellow-500 rounded-full mt-1.5 xs:mt-2 flex-shrink-0"></span>
                      <span>Keep your API key secure and don't share it with others</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
