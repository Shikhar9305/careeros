import { useRef, useEffect, useState } from 'react'
import ARScene from './ARScene'

const CameraView = ({ 
  collegeName, 
  location, 
  collegeType, 
  onStop,
  stream,
  setStream,
  cameraError,
  setCameraError 
}) => {
  const videoRef = useRef(null)
  const [isModelVisible, setIsModelVisible] = useState(true)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const toggleModel = () => {
    setIsModelVisible(!isModelVisible)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">AR Campus View - {collegeName}</h3>
          <div className="flex space-x-2">
            <button
              onClick={toggleModel}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                isModelVisible 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {isModelVisible ? '3D ON' : '3D OFF'}
            </button>
            <button
              onClick={onStop}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Stop AR
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-96 md:h-[500px] bg-black">
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-lg mb-4">{cameraError}</p>
              <button
                onClick={() => setCameraError('')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Camera Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* AR 3D Scene Overlay */}
            {isModelVisible && (
              <ARScene 
                collegeName={collegeName}
                location={location}
                collegeType={collegeType}
              />
            )}

            {/* AR Instructions */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black bg-opacity-60 rounded-lg p-3">
                <div className="flex justify-between items-center text-white text-sm">
                  <div>
                    <p className="font-medium">🎯 AR Instructions:</p>
                    <p>• Drag to rotate camera</p>
                    <p>• Scroll to zoom in/out</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">📍 {location}</p>
                    <p>🎓 {collegeType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance indicator */}
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                LIVE AR
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls Bar */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              AR Camera Active
            </div>
            <button
              onClick={toggleModel}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isModelVisible ? 'Hide 3D Model' : 'Show 3D Model'}
            </button>
          </div>
          <div className="text-sm text-gray-600">
            💡 Move your device for better AR experience
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraView