import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, X, RotateCcw, Check, AlertCircle, Smartphone } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onClose, isLoading = false }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get available camera devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
        // Prefer back camera on mobile
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        if (backCamera) {
          setSelectedDeviceId(backCamera.deviceId);
        }
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    };
    
    getDevices();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setIsInitializing(true);
      console.log('Starting camera...');
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
          facingMode: selectedDeviceId ? undefined : facingMode,
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        }
      };

      console.log('Camera constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        console.log('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        
        // Wait for video to load before playing
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting playback...');
          videoRef.current?.play().catch(console.error);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
        };
        
        setIsCameraOpen(true);
        setIsInitializing(false);
        console.log('Camera state set to open');
      } else {
        console.error('Video ref is null');
        setIsInitializing(false);
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError('Failed to access camera. Please try again.');
      }
      setIsInitializing(false);
    }
  }, [selectedDeviceId, facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current && !isCapturing) {
      setIsCapturing(true);
      
      // Add capture animation delay
      setTimeout(() => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (canvas && video) {
          const context = canvas.getContext('2d');
          
          if (context) {
            // Set canvas size to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw video frame to canvas
            context.drawImage(video, 0, 0);
            
            // Convert to data URL for preview
            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setCapturedImage(imageDataUrl);
            setIsCapturing(false);
            stopCamera();
          }
        }
      }, 150);
    }
  }, [isCapturing, stopCamera]);

  const handleVideoClick = useCallback(() => {
    if (isCameraOpen && !isCapturing) {
      capturePhoto();
    }
  }, [isCameraOpen, isCapturing, capturePhoto]);

  const confirmCapture = useCallback(() => {
    if (capturedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
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
              onCapture(file);
              setCapturedImage(null);
            }
          }, 'image/jpeg', 0.9);
        };
        img.src = capturedImage;
      }
    }
  }, [capturedImage, onCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const switchCamera = useCallback(() => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
      
      if (isCameraOpen) {
        stopCamera();
        setTimeout(() => {
          startCamera();
        }, 100);
      }
    } else {
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
      if (isCameraOpen) {
        stopCamera();
        setTimeout(() => {
          startCamera();
        }, 100);
      }
    }
  }, [devices, selectedDeviceId, isCameraOpen, stopCamera, startCamera]);

  // Auto-start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      const timeoutId = captureTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [startCamera, stopCamera]);

  return createPortal(
    <div className="webcam-modal fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-blue-100/30 rounded-3xl transform rotate-1 scale-[1.02] -z-10"></div>
        
        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Capture Food Image</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Camera Error */}
          {cameraError && (
            <div className="mb-6 animate-fade-in-up">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 text-base font-medium">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="text-red-600 text-sm underline hover:no-underline mt-1"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Camera View */}
          {(isCameraOpen || isInitializing) && !capturedImage && (
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
              <video
                ref={videoRef}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover bg-gray-100 cursor-pointer"
                playsInline
                muted
                autoPlay
                onClick={handleVideoClick}
              />
              
              {/* Camera status indicator */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>

              {/* Tap to capture hint */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="flex items-center space-x-2 text-white text-sm font-medium">
                    <Smartphone className="w-4 h-4" />
                    <span>Tap to capture</span>
                  </div>
                </div>
              </div>
              
              {/* Capture flash effect */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-pulse opacity-80"></div>
              )}
              
              {/* Loading overlay */}
              {isInitializing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm">Starting camera...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && (
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
              <img
                src={capturedImage}
                alt="Captured food"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Captured</span>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          {isCameraOpen && !capturedImage && (
            <div className="flex justify-center items-center space-x-8 mb-6">
              {/* Cancel Button */}
              <button
                onClick={onClose}
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
              
              {/* Switch Camera Button */}
              {(devices.length > 1 || !selectedDeviceId) && (
                <button
                  onClick={switchCamera}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {capturedImage && (
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
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-pulse" />
                    Use This Image
                  </>
                )}
              </button>
              <button
                onClick={retakePhoto}
                className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Retake Photo
              </button>
            </div>
          )}

          {/* Instructions */}
          {!capturedImage && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isCameraOpen 
                  ? "Position your food in the frame and tap the capture button or click on the video"
                  : "Camera is starting up..."
                }
              </p>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WebcamCapture;
