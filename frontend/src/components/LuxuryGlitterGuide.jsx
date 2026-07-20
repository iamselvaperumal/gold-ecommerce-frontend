import { useEffect, useMemo, useRef } from 'react'
import { ParticleEngine } from './glitter/ParticleEngine.js'
import { GlitterTrail } from './glitter/GlitterTrail.js'
import { PathController } from './glitter/PathController.js'
import { HoverInteraction } from './glitter/HoverInteraction.js'
import { ScrollGuide } from './glitter/ScrollGuide.js'

const DEFAULT_COLORS = {
  primary: '#D4AF37',
  highlight: '#F7E7A9',
  sparkle: '#FFF8D6',
}

const DEFAULT_PATH = [
  '[data-glitter-guide="hero"]',
  '[data-glitter-guide="rate"]',
  '[data-glitter-guide="categories"]',
  '[data-glitter-guide="coins"]',
  '[data-glitter-guide="featured"]',
  '[data-glitter-guide="cta"]',
]

const DEFAULT_HOVER = [
  '[data-glitter-hover]',
  '.store-promo',
  '.store-cat',
  '.product-card',
  '.view-all-link',
  '.newsletter-form button',
  '.promo-carousel-controls button',
]

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])
}

function resolveParticleCount(count, performanceMode) {
  const width = window.innerWidth
  if (width < 480) return Math.round(count * 0.38)
  if (width < 768) return Math.round(count * 0.58)
  return performanceMode ? Math.round(count * 0.68) : count
}

export default function LuxuryGlitterGuide({
  particleCount = 240,
  speed = 1,
  colors = DEFAULT_COLORS,
  path = DEFAULT_PATH,
  hoverSelectors = DEFAULT_HOVER,
  intensity = 0.72,
  trailLength = 62,
  trailWidth = 18,
  sparkleFrequency = 0.78,
  hoverBehavior = true,
  idleBehavior = true,
  scrollBehavior = true,
  hoverDuration = 1.2,
  performanceMode = false,
  zIndex = 35,
}) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !idleBehavior) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined

    const config = {
      speed,
      trailLength,
      trailWidth,
      sparkleFrequency,
      performanceMode,
      intensity,
      hoverDuration,
      spawnLength: 170,
      starFrequency: 0.82,
      palette: { ...DEFAULT_COLORS, ...colors },
      clock: 0,
    }

    let maxParticles = resolveParticleCount(particleCount, performanceMode)
    let frame = 0
    let lastTime = performance.now()
    let hidden = false

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      maxParticles = resolveParticleCount(particleCount, performanceMode)
    }

    const engine = new ParticleEngine(config)
    const trail = new GlitterTrail(config)
    const controller = new PathController(config)
    const scrollGuide = scrollBehavior ? new ScrollGuide(path) : null
    const hover = hoverBehavior
      ? new HoverInteraction(
        element => controller.setHoverTarget(element),
        () => controller.clearHover(),
        hoverSelectors,
      )
      : null

    const updateWaypoints = () => {
      if (scrollGuide) controller.setWaypoints(scrollGuide.waypoints)
    }

    const scanHover = () => hover?.scan()
    const waypointTimer = window.setInterval(updateWaypoints, 1200)
    const hoverTimer = hover ? window.setInterval(scanHover, 900) : null

    resize()
    updateWaypoints()
    scanHover()

    const onVisibility = () => {
      hidden = document.hidden
      if (!hidden) {
        lastTime = performance.now()
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    const loop = now => {
      if (hidden) return
      rafRef.current = requestAnimationFrame(loop)
      const delta = Math.min(2, Math.max(0.5, (now - lastTime) / 16.67))
      lastTime = now
      frame += delta
      config.clock = frame

      controller.update(delta)
      trail.push(controller.x, controller.y)

      const hoverBoost = controller.hoverStrength > 0.05 ? 2 : 0
      const spawnEvery = engine.count > maxParticles * 0.82 ? 3 : 2
      if (Math.floor(frame) % spawnEvery === 0 && engine.count < maxParticles) {
        const count = Math.min(4 + hoverBoost, maxParticles - engine.count)
        engine.spawnAt(controller.x, controller.y, count, controller.velocityX, controller.velocityY)
      }

      engine.update(frame, controller.velocityX, controller.velocityY)

      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      trail.draw(context, controller.hoverStrength)
      engine.draw(context)
    }

    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.clearInterval(waypointTimer)
      if (hoverTimer) window.clearInterval(hoverTimer)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      hover?.destroy()
      scrollGuide?.destroy()
    }
  }, [
    colors,
    hoverBehavior,
    hoverDuration,
    hoverSelectors,
    idleBehavior,
    intensity,
    particleCount,
    path,
    performanceMode,
    reducedMotion,
    scrollBehavior,
    sparkleFrequency,
    speed,
    trailLength,
    trailWidth,
  ])

  if (reducedMotion || !idleBehavior) return null

  return (
    <>
      <style>{`
        .luxury-glitter-hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 46px rgba(212, 175, 55, 0.22), 0 10px 28px rgba(14, 75, 70, 0.12) !important;
        }

        .store-cat.luxury-glitter-hover,
        .view-all-link.luxury-glitter-hover,
        .newsletter-form button.luxury-glitter-hover,
        .promo-carousel-controls button.luxury-glitter-hover {
          transform: translateY(-4px);
        }

        .luxury-glitter-hover img {
          filter: saturate(1.05) brightness(1.04);
        }
      `}</style>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex,
          opacity: 1,
          mixBlendMode: 'normal',
          contain: 'strict',
        }}
      />
    </>
  )
}