import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Hero3DCanvasProps {
  interactive?: boolean
}

export function Hero3DCanvas({ interactive = true }: Hero3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene & Camera setup
    const scene = new THREE.Scene()
    const width = container.clientWidth || 600
    const height = container.clientHeight || 540

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000)
    camera.position.set(0, 0, 26)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.9)
    scene.add(ambientLight)

    const cyanPoint = new THREE.PointLight(0x22d3ee, 3.5, 60)
    cyanPoint.position.set(12, 14, 15)
    scene.add(cyanPoint)

    const indigoPoint = new THREE.PointLight(0x3b82f6, 3.0, 50)
    indigoPoint.position.set(-14, -12, 10)
    scene.add(indigoPoint)

    const rimPoint = new THREE.PointLight(0x06b6d4, 2.0, 40)
    rimPoint.position.set(0, -15, -8)
    scene.add(rimPoint)

    // Master Group for 3D Neural System
    const neuralGroup = new THREE.Group()
    scene.add(neuralGroup)

    // 1. Central Neural AI Nucleus
    const coreGroup = new THREE.Group()
    neuralGroup.add(coreGroup)

    // Inner Luminous Core
    const innerCoreGeo = new THREE.IcosahedronGeometry(2.8, 3)
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.85,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.88,
    })
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat)
    coreGroup.add(innerCoreMesh)

    // Outer Geodesic Translucent Wireframe Lattice
    const outerGeo = new THREE.IcosahedronGeometry(4.4, 2)
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      emissive: 0x0891b2,
      emissiveIntensity: 0.45,
    })
    const outerMesh = new THREE.Mesh(outerGeo, outerMat)
    coreGroup.add(outerMesh)

    // Glowing Vertex Synapse Points
    const synapseGeo = new THREE.IcosahedronGeometry(4.4, 2)
    const synapseMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.22,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    })
    const synapsePoints = new THREE.Points(synapseGeo, synapseMat)
    coreGroup.add(synapsePoints)

    // 2. Cinematic Orbital Energy Rings
    const ringGroup = new THREE.Group()
    neuralGroup.add(ringGroup)

    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    })
    const ring1Geo = new THREE.RingGeometry(6.6, 6.66, 96)
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.x = Math.PI / 3
    ring1.rotation.y = Math.PI / 10
    ringGroup.add(ring1)

    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    })
    const ring2Geo = new THREE.RingGeometry(8.2, 8.25, 96)
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 6
    ringGroup.add(ring2)

    // 3. Omnichannel Ingestion Nodes (WhatsApp, Instagram, Messenger, Web)
    const channelConfigs = [
      { name: 'WhatsApp', color: 0x22c55e, angle: 0, distance: 8.8, speed: 0.008 },
      { name: 'Instagram', color: 0xec4899, angle: (Math.PI * 2) / 4, distance: 9.4, speed: 0.007 },
      { name: 'Messenger', color: 0x3b82f6, angle: (Math.PI * 4) / 4, distance: 8.6, speed: 0.009 },
      { name: 'Web', color: 0x22d3ee, angle: (Math.PI * 6) / 4, distance: 9.2, speed: 0.0065 },
    ]

    const channelNodes: { mesh: THREE.Mesh; config: typeof channelConfigs[0] }[] = []

    channelConfigs.forEach((cfg) => {
      const nodeGeo = new THREE.SphereGeometry(0.38, 24, 24)
      const nodeMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      })
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat)
      neuralGroup.add(nodeMesh)
      channelNodes.push({ mesh: nodeMesh, config: cfg })
    })

    // 4. Inward Flowing Lead Particle Stream (Representing omnichannel leads streaming into AI Qualification)
    const particleCount = 360
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)
    const particleVelocities: { x: number; y: number; z: number; speed: number; channelIdx: number }[] = []

    const palette = [
      new THREE.Color(0x22c55e), // WhatsApp green
      new THREE.Color(0xec4899), // IG pink
      new THREE.Color(0x3b82f6), // Messenger blue
      new THREE.Color(0x22d3ee), // Web cyan
      new THREE.Color(0x38bdf8), // Accent sky
    ]

    // Initialize particles in a spherical distribution outside the core
    for (let i = 0; i < particleCount; i++) {
      const channelIdx = i % channelConfigs.length
      const chosenColor = palette[channelIdx]
      const radius = 6.5 + Math.random() * 8.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z

      particleColors[i * 3] = chosenColor.r
      particleColors[i * 3 + 1] = chosenColor.g
      particleColors[i * 3 + 2] = chosenColor.b

      particleVelocities.push({
        x,
        y,
        z,
        speed: 0.02 + Math.random() * 0.028,
        channelIdx,
      })
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(particleGeo, particleMat)
    neuralGroup.add(particleSystem)

    // Interactive Mouse Tracking with smooth interpolation
    let targetRotX = 0
    let targetRotY = 0
    let mouseX = 0
    let mouseY = 0

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotY = mouseX * 0.32
      targetRotX = -mouseY * 0.24
    }

    window.addEventListener('mousemove', handlePointerMove)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Smooth mouse lerp damping
      neuralGroup.rotation.y += (targetRotY - neuralGroup.rotation.y) * 0.04
      neuralGroup.rotation.x += (targetRotX - neuralGroup.rotation.x) * 0.04

      // Gentle continuous rotation
      neuralGroup.rotation.y += delta * 0.12
      coreGroup.rotation.y -= delta * 0.18
      coreGroup.rotation.x += delta * 0.08

      // Slow pulse on the inner core
      const pulseScale = 1 + Math.sin(time * 2.2) * 0.04
      innerCoreMesh.scale.set(pulseScale, pulseScale, pulseScale)

      // Ring rotations
      ring1.rotation.z += delta * 0.18
      ring2.rotation.z -= delta * 0.14

      // Channel Satellite node orbits
      channelNodes.forEach(({ mesh, config }) => {
        config.angle += config.speed
        mesh.position.x = Math.cos(config.angle) * config.distance
        mesh.position.z = Math.sin(config.angle) * config.distance
        mesh.position.y = Math.sin(time * 1.5 + config.angle * 2) * 1.4
      })

      // Inward Particle Flow simulation (leads streaming into qualification center)
      const positions = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        let px = positions[i * 3]
        let py = positions[i * 3 + 1]
        let pz = positions[i * 3 + 2]

        const dist = Math.sqrt(px * px + py * py + pz * pz)

        // If particle reaches the AI qualification core (radius <= 2.2), reset to outer boundary
        if (dist <= 2.4 || isNaN(dist)) {
          const newRadius = 10.5 + Math.random() * 4.5
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          positions[i * 3] = newRadius * Math.sin(phi) * Math.cos(theta)
          positions[i * 3 + 1] = newRadius * Math.sin(phi) * Math.sin(theta)
          positions[i * 3 + 2] = newRadius * Math.cos(phi)
        } else {
          // Flow toward origin (0, 0, 0)
          const moveSpeed = particleVelocities[i].speed * (1 + (8.0 / (dist + 1)))
          const nx = px / dist
          const ny = py / dist
          const nz = pz / dist

          // Add slight spiral swirl for fluid motion
          positions[i * 3] -= (nx * moveSpeed) + (ny * 0.008)
          positions[i * 3 + 1] -= (ny * moveSpeed) - (nx * 0.008)
          positions[i * 3 + 2] -= (nz * moveSpeed)
        }
      }

      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      innerCoreGeo.dispose()
      innerCoreMat.dispose()
      outerGeo.dispose()
      outerMat.dispose()
      synapseGeo.dispose()
      synapseMat.dispose()
      ring1Geo.dispose()
      ring1Mat.dispose()
      ring2Geo.dispose()
      ring2Mat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
    }
  }, [interactive])

  return (
    <div 
      ref={containerRef} 
      className="hero-3d-canvas-container"
      style={{ width: '100%', height: '100%', minHeight: '520px', position: 'relative' }}
      aria-label="Interactive 3D LeadHive Neural AI Sales Matrix"
    />
  )
}
