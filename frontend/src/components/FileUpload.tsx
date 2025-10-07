import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Camera, Sparkles, Zap } from 'lucide-react';
import WebcamCapture from './WebcamCapture';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  onWebcamOpen?: () => void;
  onWebcamClose?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading = false, onWebcamOpen, onWebcamClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);

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

    if (uploadRef.current) {
      observer.observe(uploadRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setSelectedFile(imageFile);
      onFileSelect(imageFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleWebcamCapture = useCallback((file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
    setShowWebcam(false);
  }, [onFileSelect]);

  const openWebcam = useCallback(() => {
    setShowWebcam(true);
    onWebcamOpen?.();
  }, [onWebcamOpen]);

  const closeWebcam = useCallback(() => {
    setShowWebcam(false);
    onWebcamClose?.();
  }, [onWebcamClose]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {showWebcam ? (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={closeWebcam}
          isLoading={isLoading}
        />
      ) : !selectedFile ? (
        <div ref={uploadRef} className="space-y-8">
          {/* Upload Zone */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
            <div
              className={`relative bg-white/90 backdrop-blur-sm border-2 border-dashed rounded-3xl p-8 sm:p-12 lg:p-16 text-center cursor-pointer transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
                isDragOver 
                  ? 'border-primary-500 bg-primary-50 scale-105' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="flex flex-col items-center space-y-6">
                {/* Animated Upload Icon */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
                      Upload Your Food Image
                    </span>
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-sm sm:text-base text-gray-500">
                    Supports JPG, PNG, WEBP formats
                  </p>
                </div>
                
                <button
                  type="button"
                  className="group btn-primary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                      Choose File
                    </>
                  )}
                </button>
              </div>
              
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Camera Option */}
          <div className="text-center">
            <div className="text-gray-500 mb-6 text-lg font-medium">or</div>
            <button
              type="button"
              onClick={openWebcam}
              className="group btn-secondary inline-flex items-center text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
              Capture with Camera
            </button>
          </div>

        </div>
      ) : selectedFile ? (
        <div className="animate-fade-in-up">
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
                
                <button
                  onClick={clearFile}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Uploaded food"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Ready for Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
