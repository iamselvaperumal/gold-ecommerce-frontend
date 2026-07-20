import { noise2 } from './noise.js'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

export class PathController {
  constructor(config) {
    this.config = config
    this.x = typeof window !== 'undefined' ? -140 : 0
    this.y = typeof window !== 'undefined' ? window.innerHeight * 0.38 : 280
    this.prevX = this.x
    this.prevY = this.y
    this.vx = 2.8
    this.vy = 0
    this.time = 0
    this.waypoints = []
    this.waypointIndex = 0
    this.hoverTarget = null
    this.hoverStrength = 0
    this.hoverFrame = 0
    this.hoverDuration = Math.round((config.hoverDuration ?? 1.2) * 60)
    this.initialized = false
  }

  setWaypoints(points) {
    this.waypoints = points || []
    if (!this.initialized && this.waypoints.length) {
      const first = this.waypoints[0]
      this.x = Math.min(-120, first.x - 420)
      this.y = first.y
      this.prevX = this.x
      this.prevY = this.y
      this.initialized = true
    }
  }

  setHoverTarget(el) {
    if (!el) return
    const rect = el.getBoundingClientRect()
    this.hoverTarget = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      w: rect.width,
      h: rect.height,
    }
    this.hoverFrame = 0
  }

  clearHover() {
    this.hoverTarget = null
    this.hoverFrame = 0
  }

  nextWaypoint() {
    if (!this.waypoints.length) return null
    const current = this.waypoints[this.waypointIndex]
    const distance = Math.hypot(current.x - this.x, current.y - this.y)
    if (distance < 80) this.waypointIndex += 1

    if (this.waypointIndex >= this.waypoints.length) {
      this.waypointIndex = 0
      const first = this.waypoints[0]
      return { x: window.innerWidth + 180, y: first?.y ?? window.innerHeight * 0.42 }
    }

    return this.waypoints[this.waypointIndex]
  }

  hoverPoint() {
    if (!this.hoverTarget) return null
    this.hoverFrame += 1
    const progress = clamp(this.hoverFrame / this.hoverDuration, 0, 1)
    const eased = easeInOutSine(progress)
    const angle = -Math.PI * 0.55 + eased * Math.PI * 2
    const radiusX = Math.min(260, Math.max(46, this.hoverTarget.w * 0.58))
    const radiusY = Math.min(140, Math.max(26, this.hoverTarget.h * 0.58))

    return {
      x: this.hoverTarget.x + Math.cos(angle) * radiusX,
      y: this.hoverTarget.y + Math.sin(angle) * radiusY,
    }
  }

  update() {
    this.time += 1
    this.prevX = this.x
    this.prevY = this.y

    const routeTarget = this.nextWaypoint() || {
      x: window.innerWidth * 0.72,
      y: window.innerHeight * 0.42,
    }
    const hoverTarget = this.hoverPoint()

    if (hoverTarget) this.hoverStrength = clamp(this.hoverStrength + 0.075, 0, 1)
    else this.hoverStrength = clamp(this.hoverStrength - 0.045, 0, 1)

    const hs = this.hoverStrength
    const targetX = hoverTarget ? routeTarget.x * (1 - hs) + hoverTarget.x * hs : routeTarget.x
    const targetY = hoverTarget ? routeTarget.y * (1 - hs) + hoverTarget.y * hs : routeTarget.y
    const dx = targetX - this.x
    const dy = targetY - this.y
    const distance = Math.hypot(dx, dy) || 1
    const spring = 0.045 + hs * 0.028
    const nX = noise2(this.time * 0.008, this.y * 0.003)
    const nY = noise2(this.x * 0.003, this.time * 0.008 + 41)
    const wave = Math.sin(this.time * 0.045) * (this.config.trailWidth ?? 12) * 0.018

    this.vx += (dx / distance) * spring * (this.config.speed ?? 1)
    this.vy += (dy / distance) * spring * (this.config.speed ?? 1)
    this.vx += nX * 0.035 + wave
    this.vy += nY * 0.032 + Math.sin(this.time * 0.032) * 0.028
    this.vx *= 0.94
    this.vy *= 0.94

    const speed = Math.hypot(this.vx, this.vy)
    const maxSpeed = 4.9 + hs * 3.2
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed
      this.vy = (this.vy / speed) * maxSpeed
    }

    this.x += this.vx
    this.y += this.vy

    const lowerBound = window.innerHeight + 160
    if (this.x > window.innerWidth + 220 || this.y > lowerBound) {
      const first = this.waypoints[0] || { y: window.innerHeight * 0.38 }
      this.x = -160
      this.y = first.y + Math.sin(this.time * 0.01) * 24
      this.prevX = this.x - 1
      this.prevY = this.y
      this.vx = 2.8
      this.vy = 0
      this.waypointIndex = 0
    }
  }

  get velocityX() {
    return this.x - this.prevX
  }

  get velocityY() {
    return this.y - this.prevY
  }
}