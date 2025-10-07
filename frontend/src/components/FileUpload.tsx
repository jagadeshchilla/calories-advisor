import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Camera, CameraOff, Sparkles, Zap } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setCameraError(null);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraError('Camera access denied. Please allow camera permissions to capture photos.');
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      
      // Add a brief delay to show capture animation
      setTimeout(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (canvas && video) {
          const context = canvas.getContext('2d');
          
          if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);
            
            // Convert canvas to data URL to show preview
            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(imageDataUrl);
            setShowCaptureButton(true);
            setIsCapturing(false);
            closeCamera();
          }
        }
      }, 200);
    }
  }, [closeCamera]);

  const confirmCapture = useCallback(() => {
    if (capturedImage && canvasRef.current) {
      // Create a new canvas to convert data URL to blob
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Create an image from the data URL
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
                type: 'image/jpeg'
              });
              setSelectedFile(file);
              onFileSelect(file);
              setCapturedImage(null);
              setShowCaptureButton(false);
            }
          }, 'image/jpeg', 0.8);
        };
        img.src = capturedImage;
      }
    }
  }, [capturedImage, onFileSelect]);

  const retakePhoto = useCallback(async () => {
    setCapturedImage(null);
    setShowCaptureButton(false);
    await requestCameraPermission();
  }, [requestCameraPermission]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!selectedFile && !isCameraOpen && !capturedImage ? (
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
              onClick={requestCameraPermission}
              className="group btn-secondary inline-flex items-center text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
              Capture with Camera
            </button>
          </div>

          {/* Camera Error */}
          {cameraError && (
            <div className="animate-fade-in-up">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <CameraOff className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-red-800 text-base">{cameraError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : isCameraOpen ? (
        <div className="animate-fade-in-up">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Camera Capture</h3>
                </div>
                <button
                  onClick={closeCamera}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <video
                  ref={videoRef}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover bg-gray-100"
                  playsInline
                  muted
                  autoPlay
                />
                {/* Camera status indicator */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                {/* Camera controls overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center space-x-4">
                      <div className="text-white text-sm font-medium">Tap to capture</div>
                    </div>
                  </div>
                </div>
                
                {/* Capture flash effect */}
                {isCapturing && (
                  <div className="absolute inset-0 bg-white animate-pulse opacity-80"></div>
                )}
              </div>
              
              {/* Camera Controls */}
              <div className="mt-6 flex justify-center items-center space-x-8">
                {/* Cancel Button */}
                <button
                  onClick={closeCamera}
                  className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {/* Capture Button */}
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing}
                  className={`group w-20 h-20 bg-white hover:bg-gray-100 border-4 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl ${
                    isCapturing 
                      ? 'border-gray-400 opacity-75' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCapturing 
                      ? 'bg-gray-600' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}>
                    {isCapturing ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                </button>
                
                {/* Placeholder for future features */}
                <div className="w-12 h-12"></div>
              </div>
              
              {/* Instructions */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Position your food in the frame and tap the capture button
                </p>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      ) : capturedImage && showCaptureButton ? (
        <div className="animate-fade-in-up">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Captured Image</h3>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
                <img
                  src={capturedImage}
                  alt="Captured food"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Captured</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={confirmCapture}
                  className="group btn-primary inline-flex items-center justify-center text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                      Analyze This Image
                    </>
                  )}
                </button>
                <button
                  onClick={retakePhoto}
                  className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Retake Photo
                </button>
              </div>
            </div>
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
