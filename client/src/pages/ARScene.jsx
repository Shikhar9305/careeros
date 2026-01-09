import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { Suspense } from 'react'
import ModelLoader from './ModelLoader'

const ARScene = ({ collegeName, location, collegeType }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ 
          position: [0, 2, 5], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        className="pointer-events-auto"
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment for better reflections */}
        <Environment preset="city" />

        {/* 3D Model */}
        <Suspense fallback={
          <Html center>
            <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
              <div className="animate-spin text-2xl mb-2">⚙️</div>
              <p>Loading 3D Model...</p>
            </div>
          </Html>
        }>
          <ModelLoader
            modelPath="/college_3d.glb"
            position={[0, -1, 0]}
            scale={0.8}
            rotation={[0, Math.PI / 4, 0]}
          />
        </Suspense>

        {/* Controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Info Labels */}
        <Html position={[0, 3, 0]} center>
          <div className="bg-indigo-600 bg-opacity-90 text-white px-4 py-2 rounded-lg text-center pointer-events-none">
            <h3 className="font-bold text-lg">{collegeName}</h3>
            <p className="text-sm">{location} • {collegeType}</p>
          </div>
        </Html>

        <Html position={[-2, 1, 2]} center>
          <div className="bg-green-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
            📚 Library
          </div>
        </Html>

        <Html position={[2, 1, -2]} center>
          <div className="bg-blue-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
            🔬 Labs
          </div>
        </Html>

        <Html position={[0, 1, -3]} center>
          <div className="bg-orange-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
            🏫 Main Building
          </div>
        </Html>
      </Canvas>
    </div>
  )
}

export default ARScene