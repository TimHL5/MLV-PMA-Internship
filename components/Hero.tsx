'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

// 3D Floating Shapes Component with MLV brand colors
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Slowed down rotation for smoother, less jarring animation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.015
    }
  })

  return (
    <group ref={groupRef}>
      {/* Large sphere - main focal point (brand green) - Slowed down for smoother animation */}
      <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.4}>
        <Sphere args={[1.5, 64, 64]} position={[-4, 2, -5]}>
          <MeshDistortMaterial
            color="#6AC670"
            attach="material"
            distort={0.3}
            speed={0.8}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>

      {/* Icosahedron (brand yellow) - Reduced speed */}
      <Float speed={0.5} rotationIntensity={0.4} floatIntensity={0.3}>
        <Icosahedron args={[0.8, 1]} position={[4, -1, -3]}>
          <meshStandardMaterial
            color="#F2CF07"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.6}
          />
        </Icosahedron>
      </Float>

      {/* Torus (accent teal) - Reduced speed */}
      <Float speed={0.7} rotationIntensity={0.6} floatIntensity={0.4}>
        <Torus args={[0.6, 0.2, 16, 100]} position={[3, 2, -4]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial
            color="#4ECDC4"
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.5}
          />
        </Torus>
      </Float>

      {/* Small spheres scattered - Reduced count from 8 to 5 and slowed down */}
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={0.3 + i * 0.08} floatIntensity={0.2 + i * 0.05}>
          <Sphere
            args={[0.15 + Math.random() * 0.2, 32, 32]}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 6,
              -2 - Math.random() * 5,
            ]}
          >
            <meshStandardMaterial
              color={['#6AC670', '#F2CF07', '#4ECDC4', '#C77DFF'][i % 4]}
              roughness={0.3}
              metalness={0.7}
              transparent
              opacity={0.4}
            />
          </Sphere>
        </Float>
      ))}

      {/* Rotating boxes (brand green) - Reduced speed */}
      <Float speed={0.5} rotationIntensity={0.5} floatIntensity={0.25}>
        <Box args={[0.5, 0.5, 0.5]} position={[-3, -2, -4]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial
            color="#6AC670"
            roughness={0.15}
            metalness={0.85}
            transparent
            opacity={0.5}
          />
        </Box>
      </Float>

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6AC670" />
      <pointLight position={[10, -10, 5]} intensity={0.3} color="#F2CF07" />
    </group>
  )
}

// Main Hero Component
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Reduced mouse sensitivity for more subtle effect
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 8,
        y: (e.clientY / window.innerHeight - 0.5) * 8,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Smooth mouse position interpolation for gentler transitions
  useEffect(() => {
    const smoothing = 0.05 // Lower = smoother/slower
    const animate = () => {
      setSmoothMousePosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * smoothing,
        y: prev.y + (mousePosition.y - prev.y) * smoothing,
      }))
    }
    const interval = setInterval(animate, 16) // ~60fps
    return () => clearInterval(interval)
  }, [mousePosition])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter to-dark" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      {/* Radial gradient orbs - brand colors - Subtle mouse follow with smooth transitions */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(106, 198, 112, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: smoothMousePosition.x * 0.15,
          y: smoothMousePosition.y * 0.15,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(242, 207, 7, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          x: smoothMousePosition.x * -0.1,
          y: smoothMousePosition.y * -0.1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
      />

      {/* 3D Canvas - z-index 0 */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <FloatingShapes />
        </Canvas>
      </div>

      {/* Main content - z-index 10 */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto pt-20"
        style={{ y, opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-lighter/80 backdrop-blur-sm border border-primary/30 mb-6 sm:mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm text-gray-300">Applications Open for 2026 Cohort</span>
        </motion.div>

        {/* Main headline - larger on mobile */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
        >
          <span className="block text-white">Don&apos;t Just Learn</span>
          <span className="block gradient-text">Startups.</span>
          <span className="block text-white mt-1 sm:mt-2">Build One.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-4 sm:mb-6 max-w-3xl mx-auto"
        >
          <span className="text-white font-medium">MLV Product Management Associate Program</span>
          <span className="mx-2 sm:mx-3 text-primary">|</span>
          <span>2026 Cohort</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-sm sm:text-base text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto"
        >
          For US college students with roots in Hong Kong, Vietnam, or Singapore.
          <br className="hidden sm:block" />
          Remote spring shadowing → On-ground summer venture building in Asia.
        </motion.p>

        {/* CTA Buttons - stack on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="/apply"
            className="w-full sm:w-auto cta-button group relative overflow-hidden text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Apply Now
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </span>
          </motion.a>

          <motion.a
            href="#overview"
            className="w-full sm:w-auto cta-button-secondary text-center flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </motion.a>
        </motion.div>

        {/* Stats preview - 2x2 on mobile, 4x1 on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '8', label: 'Months' },
            { value: '$50K+', label: 'Revenue Target' },
            { value: '3', label: 'Countries' },
            { value: '2', label: 'Phases' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator - FIXED: Now positioned BELOW stats with proper spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12 sm:mt-16 flex flex-col items-center gap-3 relative z-20"
        >
          <span className="text-sm text-gray-400 tracking-wider uppercase">Scroll to explore</span>
          <div className="flex items-center gap-3">
            {/* Mouse icon */}
            <motion.div
              className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2"
              animate={{
                borderColor: ['rgba(106, 198, 112, 0.5)', 'rgba(242, 207, 7, 0.5)', 'rgba(106, 198, 112, 0.5)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-3 bg-primary rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            {/* Arrow down */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade - z-index 5 to not cover scroll indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark to-transparent pointer-events-none z-5" />
    </section>
  )
}
