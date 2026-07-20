import { noise2 } from './noise.js'

const DEFAULT_PALETTE = {
  primary: '#D4AF37',
  highlight: '#F7E7A9',
  sparkle: '#FFF8D6',
}

const GOLD_SWATCHES = ['primary', 'highlight', 'primary', 'sparkle']

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function pickColor(palette) {
  const key = GOLD_SWATCHES[Math.floor(Math.random() * GOLD_SWATCHES.length)]
  return palette[key] || DEFAULT_PALETTE[key]
}

function drawStar(ctx, x, y, radius, points, rotation) {
  const inner = radius * 0.34
  ctx.beginPath()
  for (let i = 0; i < points * 2; i += 1) {
    const angle = rotation + (Math.PI * i) / points
    const r = i % 2 === 0 ? radius : inner
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

function drawGlint(ctx, particle) {
  const pulse = 0.62 + Math.pow(Math.abs(Math.sin(particle.sparklePhase)), 4) * 0.5
  const radius = particle.size * (particle.star ? 3.2 : 2.2) * pulse
  const line = radius * (particle.star ? 1.85 : 1.15)

  ctx.save()
  ctx.translate(particle.x, particle.y)
  ctx.rotate(particle.rotation)
  ctx.lineWidth = particle.star ? 0.72 : 0.48
  ctx.strokeStyle = particle.color
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(-line, 0)
  ctx.lineTo(line, 0)
  ctx.moveTo(0, -line)
  ctx.lineTo(0, line)
  if (particle.star) {
    const diagonal = line * 0.52
    ctx.moveTo(-diagonal, -diagonal)
    ctx.lineTo(diagonal, diagonal)
    ctx.moveTo(diagonal, -diagonal)
    ctx.lineTo(-diagonal, diagonal)
  }
  ctx.stroke()
  ctx.restore()
}

export class Particle {
  constructor(config) {
    this.reset(0, 0, 0, 0, config)
  }

  reset(x, y, tangentX, tangentY, config) {
    const palette = config.palette || DEFAULT_PALETTE
    const ribbonWidth = config.trailWidth ?? 12
    const tangentLength = Math.hypot(tangentX, tangentY) || 1
    const normalX = -tangentY / tangentLength
    const normalY = tangentX / tangentLength
    const along = (Math.random() - 0.5) * (config.spawnLength ?? 150)
    const across = (Math.random() - 0.5) * ribbonWidth * 4.2

    this.x = x + tangentX / tangentLength * along + normalX * across
    this.y = y + tangentY / tangentLength * along + normalY * across
    this.size = 0.45 + Math.random() * (config.performanceMode ? 1.05 : 1.7)
    this.maxAlpha = clamp(0.22 + Math.random() * 0.58, 0.2, 0.82) * (config.intensity ?? 1)
    this.alpha = 0
    this.color = pickColor(palette)
    this.life = 0
    this.maxLife = 56 + Math.random() * 118
    this.seedX = Math.random() * 1000
    this.seedY = Math.random() * 1000
    this.vx = tangentX * (0.035 + Math.random() * 0.035)
    this.vy = tangentY * (0.035 + Math.random() * 0.035)
    this.star = Math.random() < (config.starFrequency ?? 0.72)
    this.points = Math.random() < 0.35 ? 6 : 4
    this.rotation = Math.random() * Math.PI
    this.spin = (Math.random() - 0.5) * 0.018
    this.sparklePhase = Math.random() * Math.PI * 2
    this.dead = false
  }

  update(time, ribbonVx, ribbonVy, config) {
    this.life += 1
    if (this.life >= this.maxLife) {
      this.dead = true
      return
    }

    const t = this.life / this.maxLife
    const fadeIn = clamp(t / 0.14, 0, 1)
    const fadeOut = clamp((1 - t) / 0.42, 0, 1)
    const breath = 0.72 + Math.sin(time * 0.02 + this.seedX) * 0.16
    const fieldX = noise2(this.x * 0.004 + this.seedX, time * 0.003)
    const fieldY = noise2(this.y * 0.004 + this.seedY, time * 0.003 + 31)

    this.vx = this.vx * 0.93 + (fieldX * 0.18 + ribbonVx * 0.032) * (config.speed ?? 1)
    this.vy = this.vy * 0.93 + (fieldY * 0.15 + ribbonVy * 0.032) * (config.speed ?? 1)
    this.x += this.vx
    this.y += this.vy
    this.rotation += this.spin
    this.sparklePhase += 0.055 + this.size * 0.006

    const twinkle = 0.48 + Math.pow(Math.abs(Math.sin(this.sparklePhase)), 7) * 0.72
    this.alpha = clamp(this.maxAlpha * fadeIn * fadeOut * breath * twinkle, 0, 0.88)
  }

  draw(ctx) {
    if (this.alpha <= 0.01) return

    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = this.star ? this.size * 5.2 : this.size * 2.3

    if (this.star && this.alpha > 0.12) {
      drawStar(ctx, this.x, this.y, this.size * 1.65, this.points, this.rotation)
      if (this.alpha > 0.28) drawGlint(ctx, this)
    } else {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size * 0.86, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

export class ParticleEngine {
  constructor(config) {
    this.config = config
    this.particles = []
    this.pool = []
  }

  spawnAt(x, y, count = 1, tangentX = 1, tangentY = 0) {
    for (let i = 0; i < count; i += 1) {
      const particle = this.pool.pop() || new Particle(this.config)
      particle.reset(x, y, tangentX, tangentY, this.config)
      this.particles.push(particle)
    }
  }

  update(time, ribbonVx, ribbonVy) {
    const alive = []
    for (const particle of this.particles) {
      particle.update(time, ribbonVx, ribbonVy, this.config)
      if (particle.dead) this.pool.push(particle)
      else alive.push(particle)
    }
    this.particles = alive
  }

  draw(ctx) {
    for (const particle of this.particles) particle.draw(ctx)
  }

  get count() {
    return this.particles.length
  }
}
