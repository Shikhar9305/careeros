import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

const ModelLoader = ({ modelPath, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) => {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef()
  const [hover, setHover] = useState(false)

  // Add rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005
      if (hover) {
        modelRef.current.scale.setScalar(scale * 1.1)
      } else {
        modelRef.current.scale.setScalar(scale)
      }
    }
  })

  return (
    <primitive
      ref={modelRef}
      object={scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    />
  )
}

// Preload the model
useGLTF.preload('/college_3d.glb')

export default ModelLoader